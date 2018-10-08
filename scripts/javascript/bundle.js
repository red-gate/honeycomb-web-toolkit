const fs = require('fs-extra');
const browserify = require('browserify');
const pkg = require('../../package.json');


const src = `${pkg.project.src}/honeycomb.js`;
const compiled = `${pkg.project.dist}/honeycomb.js`;

const b = browserify();
b.add(src);

// check for overriding arguments
if( process.argv[2] ) {
    // add additional script
    b.add(`${pkg.project.src}/${process.argv[2]}.js`);
}

b.transform('babelify');
b.bundle((err, buffer) => {
    if(err) {
        console.error('Error bundling JavaScript');
        console.error(err);
        process.exit(1);
    }

    fs.writeFile(compiled, buffer, err => {
        if(err) {
            console.error('Error writing bundled JavaScript');
            console.error(err);
            process.exit(1);
        }

        console.log(`Bundled JavaScript to ${compiled}`);
    });       
});
