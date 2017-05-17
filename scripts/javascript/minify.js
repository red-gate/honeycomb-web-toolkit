const fs = require('fs-extra');
const path = require('path');
const uglifyjs = require('uglify-js');
const pkg = require('../../package.json');

const compiled = `${pkg.project.dist}/honeycomb.js`;
const minified = `${pkg.project.dist}/honeycomb.min.js`;
const map = minified.replace('.min.js', '.js.map');

fs.readFile(compiled, 'utf8', (err, code) => {
    if(err) {
        console.error('Error reading compiled JavaScript');
        console.error(err);
        process.exit(1);
    }

    uglified = uglifyjs.minify(code);

    if(uglified.code) {
        fs.writeFile(minified, uglified.code, err => {
            if(err) {
                console.error('Error saving minified JavaScript');
                console.error(err);
                process.exit(1);
            }

            console.log(`Saved minified JavaScript to ${minified}`);
        });
    }

    if(uglified.map) {
        fs.writeFile(map, uglified.map, err => {
            if(err) {
                console.error('Error saving JavaScript sourcemap');
                console.error(err);
                process.exit(1);
            }

            console.log(`Saved JavaScript sourcemap to ${map}`);
        });
    }
});
