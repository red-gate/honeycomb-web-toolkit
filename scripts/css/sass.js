const path = require('path');
const fs = require('fs-extra');
const sass = require('node-sass');
const pkg = require('../../package.json');
const css = `${pkg.project.dist}/honeycomb.css`;
sass.render({
    file: `${pkg.project.src}/honeycomb.scss`,
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
