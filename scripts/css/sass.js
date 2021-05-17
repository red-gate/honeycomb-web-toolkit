const path = require('path');
const fs = require('fs-extra');
const sass = require('sass');
const pkg = require('../../package.json');

let scripts = [
    'honeycomb',
    'honeycomb.app'
];

// check for overriding arguments
if( process.argv[2] ) {
    scripts = [
        process.argv[2]
    ];
}

scripts.forEach(script => {
    const css = (script === 'zuora' || script === 'confluence') ? `${pkg.project.dist}/honeycomb.css` : `${pkg.project.dist}/${script}.css`;
    sass.render({
        file: `${pkg.project.src}/${script}.scss`,
        outputStyle: 'compressed',
        outFile: css
    }, ( err, result ) => {
        if(err) {
            console.error('Error compiling Sass');
            console.error(err);
            process.exit(1);
        }

        fs.ensureDir(path.dirname(css), err => {
            if(err) {
                console.error('Error creating CSS directory');
                console.error(err);
                process.exit(1);
            }

            fs.writeFile(css, result.css, err => {
                if(err) {
                    console.error('Error writing CSS file');
                    console.error(err);
                    process.exit(1);
                }

                console.log(`CSS file compiled to ${css}`);
            });
        });
    });
});
