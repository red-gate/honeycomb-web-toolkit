// Extra tasks when building on TeamCity.
const zipFolder = require("zip-folder");
const fs = require("fs");
const request = require("request");
const pkg = require('../package.json');

// Check we have the BUILD_COUNTER environment variable set - if not, we're probably not running in TC, or
// it's got lost from the env.* parameters (should be set to %build.counter%)
if (!process.env.BUILD_COUNTER) {
	console.error("BUILD_COUNTER environment variable not set: ensure TeamCity project is configured to set this to %build.counter%.");
	process.exit(1);
}
if (!process.env.OCTOPUS_URL) {
	console.error("OCTOPUS_URL environment variable not set.");
	process.exit(1);
}
if (!process.env.OCTOPUS_API_KEY) {
	console.error("OCTOPUS_API_KEY environment variable not set.");
	process.exit(1);
}

// Set the build version from package.json, plus the build counter to uniquify it
console.log("Build number set OK");
console.warn("##teamcity[buildNumber '" + pkg.version + "." + process.env.BUILD_COUNTER + "']");

// Zip up the dist folder
const pkgFilename = "RedGate.HoneycombWebToolkit." + pkg.version + ".zip";
zipFolder("dist", pkgFilename, function(err) {
	if(err) {
		console.error("Failed to zip output package", err);
		process.exit(1);
	} else {
		console.log("Created zipped package");

		// Upload the resulting package to Octopus
		const packagesEndpoint = process.env.OCTOPUS_URL + "/api/packages/raw";
		fs.createReadStream(pkgFilename).pipe(request({
			url: packagesEndpoint,
			method: "POST",
			headers: {
				"X-Octopus-ApiKey": process.env.OCTOPUS_API_KEY
			}
		}, function(err, response, body) {
			// Upload callback
			if (!err && response.statusCode == 200) {
				console.log("Package uploaded to Octopus");
			} else {
				console.error("Octopus upload failed", err, " status code ", response.statusCode);
				process.exit(1);
			}
		}));
	}
});

console.log("teamcity.js complete");