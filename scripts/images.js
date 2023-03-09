const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const pkg = require('../package.json');

const images = [
    `${pkg.project.src}/lightbox/`,
    `${pkg.project.src}/navigation/`,
    `${pkg.project.src}/carousel/`,
    `${pkg.project.src}/sharing/`,
    `${pkg.project.src}/blockquote/`,
    `${pkg.project.src}/base/`
];

images.map(async image => {
    const files = await glob(`${image}/**/*.+(gif|png|svg)`);
    if( ! files.length ) {
        console.error('Error globbing images');
        process.exit(1);
    }

    files.map(file => {
        const distPath = file.replace(pkg.project.src, pkg.project.dist);
        fs.ensureDir(path.dirname(distPath), err => {
            if(err) {
                console.error('Error ensuring image directory exists');
                console.error(err);
                process.exit(1);
            }

            fs.copy(file, distPath, err => {
                if(err) {
                    console.error('Error copying image');
                    console.error(err);
                    process.exit(1);
                }

                console.log(`Copied image ${file} to ${distPath}`);
            });
        });
    });
});
