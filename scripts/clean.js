const fs = require('fs-extra');
const pkg = require('../package.json');

fs.emptyDir(pkg.project.dist, err => {
    if(err) {
        console.error('Error emptying dist directory');
        console.error(err);
        process.exit(1);
    }

    console.log('Emptied dist directory');
})
