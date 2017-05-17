const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const pkg = require('../package.json');

const fonts = [
    `${pkg.project.src}/type/`,
    `${pkg.project.src}/icons/`
];

fonts.map(font => {
    glob(`${font}/**/*.+(svg|eot|ttf|woff)`, (err, files) => {
        if(err) {
            console.error('Error globbing fonts');
            console.error(err);
            process.exit(1);
        }

        files.map(file => {
            const distPath = file.replace(pkg.project.src, pkg.project.dist);
            fs.ensureDir(path.dirname(distPath), err => {
                if(err) {
                    console.error('Error ensuring font directory exists');
                    console.error(err);
                    process.exit(1);
                }

                fs.copy(file, distPath, err => {
                    if(err) {
                        console.error('Error copying font');
                        console.error(err);
                        process.exit(1);
                    }

                    console.log(`Copied font ${file} to ${distPath}`);
                })
            });
        });
    });
});
