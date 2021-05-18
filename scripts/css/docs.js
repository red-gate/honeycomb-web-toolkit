const sass = require('sass');
const fs = require('fs');
const handlebars = require('handlebars');
const pkg = require('../../package.json');
let selectors = [];

const filter = rule => {
    const selector = rule.trim();

    // Remove any rules that start with @, *, /, \, -, } or a number, or are empty.
    if (selector === '' || 
        selector.startsWith('@') || 
        selector.startsWith('*') || 
        selector.startsWith('/') || 
        selector.startsWith('\\') || 
        selector.startsWith('-') || 
        selector.startsWith('}') || 
        selector.match(/^\d/)) {
        return null;
    }

    // Remove any rules that have a pseudo selector in them.
    if (selector.indexOf(':') !== -1) {
        return null;
    }

    // Remove any rules that have a class name in them, but end with an element selector.
    // e.g. 'table--responsive td', but not 'table--responsive td.blah'.
    // Uses the negative lookahead regex operator.
    const reg = /\s(?!(.)*\.)/ig;
    if (selector.match(reg) !== null) {
        return null;
    }

    // Remove any rules that start with a raw HTML element.
    if (selector.indexOf('.') !== 0) {
        return null;
    }

    return selector;
};

const order = () => {
    selectors.sort((a, b) => {
        return (a < b) ? -1 : (b < a) ? 1 : 0; 
    });
};

const removeDuplicates = () => {
    let idsToRemove = [];
    let a = false;
    for (let i=0; i<selectors.length; i++) {
        if (a === selectors[i]) {
            idsToRemove.push(i);
        }

        a = selectors[i];
    }

    idsToRemove.reverse();
    idsToRemove.forEach(id => {
        selectors.splice(id, 1);
    });
};

const structure = () => {
    let structured = [];

    const getBlock = selector => {
        if (selector.indexOf('--') !== -1) {
            selector = selector.substr(0, selector.indexOf('--'));
        }

        if (selector.indexOf('__') !== -1) {
            selector = selector.substr(0, selector.indexOf('__'));
        }

        if (selector.indexOf('.', 1) !== -1) {
            selector = selector.substr(0, selector.indexOf('.', 1));
        }

        if (selector.indexOf('[') !== -1) {
            selector = selector.substr(0, selector.indexOf('['));
        }

        if (selector.indexOf(' ') !== -1) {
            selector = selector.substr(0, selector.indexOf(' '));
        }

        return selector.trim();
    };

    const getStructuredBlock = selector => {
        for (let i=0; i<structured.length; i++) {
            if (structured[i].rule === selector) {
                return structured[i];
            }
        }
        return false;
    };

    const addStructuredBlock = block => {
        const isInStructured = structured.filter(rule => rule.rule === block);
        if (isInStructured.length === 0) {
            structured.push({rule: block});
        }
    };

    selectors.forEach(selector => {
        let block = getBlock(selector);
        let rule = {
            rule: selector
        };

        addStructuredBlock(block);

        if (block !== selector) {      
            const item = getStructuredBlock(block);
            if (typeof item.children === 'undefined') {
                item.children = [];
            }
            item.children.push(rule);
        }
    });

    selectors = structured;
};

const writeDocument = () => {
    // fs.writeFileSync('./css.docs.tmp', selectors.map(selector => selector.rule).join('\n'), {encoding: 'utf-8'});
    Handlebars.run();
};

const init = () => {
    sass.render({
        file: `${pkg.project.src}/honeycomb.scss`,
        outputStyle: 'expanded',
    }, ( err, result ) => {
        if(err) {
            console.error('Error compiling Sass');
            console.error(err);
            process.exit(1);
        }
    
        fs.writeFileSync('./css.tmp', result.css, {encoding: 'utf-8'});
        const css = result.css.toString().replace(/{/ig, '').split(/(?:\r\n|\r|\n|,)/g);
    
        for (let i=0; i<css.length; i++) {
            const rule = css[i];
            const filtered = filter(rule);
            if (filtered) {
                selectors.push(filtered);
            }
        }

        order();
        
        removeDuplicates();

        structure();

        writeDocument();
    });

};

const Handlebars = (() => {
    const run = () => {
        fs.readFile('./scripts/css/docs.hb', 'utf8', ( err, source ) => {
            if (err) {
                console.error('Error reading file', err);
                process.exit(-1);
            }

            const template = handlebars.compile(source);
            const html = template({rules: selectors});

            fs.writeFile(`${pkg.project.dist}/honeycomb.css.cheatsheet.html`, html, err => {
                if (err) {
                    console.error('Error writing file', err);
                    process.exit(-1);
                }

                console.log('Compiled CSS cheatsheet');
            });
        });
    };

    return {
        run
    };
})();

init();