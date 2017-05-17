const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const pkg = require('../../package.json');

glob(`${pkg.project.src}/**/vendor/**/*.js`, (err, files) => {
    if(err) {
        console.error('Error globbing vendor scripts');
        console.error(err);
        process.exit(1);
    }

    files.map(file => {
        const distPath = file.replace(pkg.project.src, pkg.project.dist);
        fs.ensureDir(path.dirname(distPath), err => {
            if(err) {
                console.error('Error ensuring vendor directory exists');
                console.error(err);
                process.exit(1);
            }

            fs.copy(file, distPath, err => {
                if(err) {
                    console.error('Error copying vendor script');
                    console.error(err);
                    process.exit(1);
                }

                console.log(`Copied vendor script '${file}' to '${distPath}'`);
            });
        });
    });
});
