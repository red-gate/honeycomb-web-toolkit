// Extra tasks when building on TeamCity.
const zipFolder = require('zip-a-folder');
const fs = require('fs');
const request = require('request');
const pkg = require('../package.json');

// Check we have the BUILD_COUNTER environment variable set - if not, we're probably not running in TC, or
// it's got lost from the env.* parameters (should be set to %build.counter%)
if (!process.env.BUILD_COUNTER) {
    console.error('BUILD_COUNTER environment variable not set: ensure TeamCity project is configured to set this to %build.counter%.');
    process.exit(1);
}
if (!process.env.OCTOPUS_URL) {
    console.error('OCTOPUS_URL environment variable not set.');
    process.exit(1);
}
if (!process.env.OCTOPUS_API_KEY) {
    console.error('OCTOPUS_API_KEY environment variable not set.');
    process.exit(1);
}

// Set the build version from package.json, plus the build counter to uniquify it
var packageVersion = pkg.version + '.' + process.env.BUILD_COUNTER;
console.warn('##teamcity[buildNumber \'' + packageVersion + '\']');

// Zip up the dist folder
const pkgFilename = 'RedGate.HoneycombWebToolkit.' + packageVersion + '.zip';
(async () => {
    await zipFolder.zip('dist', pkgFilename);
    if (fs.existsSync(pkgFilename)) {
        console.log('Created zipped package');

        // Upload the resulting package to Octopus
        const packagesEndpoint = process.env.OCTOPUS_URL + '/api/packages/raw';

        const octopus_post_form = {
            data: fs.createReadStream(pkgFilename),
        };

        request({
            url: packagesEndpoint,
            method: 'POST',
            formData: octopus_post_form,
            headers: {
                'X-Octopus-ApiKey': process.env.OCTOPUS_API_KEY
            }
        }, function(err, response, body) {
            // Upload callback
            if (!err && response.statusCode == 201) {
                console.log('Package uploaded to Octopus');
            } else {
                console.error('Octopus upload failed', err, ' status code ', response.statusCode);
                process.exit(1);
            }
        });
    } else {
        console.error('Failed to zip output package');
        process.exit(1);
    }

    console.log('teamcity.js complete');
})();