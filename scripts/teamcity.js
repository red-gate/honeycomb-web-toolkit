// Extra tasks when building on TeamCity.
const zipFolder = require("zip-folder");
const fs = require("fs-extra");
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
var packageVersion = pkg.version + "." + process.env.BUILD_COUNTER;
console.warn("##teamcity[buildNumber '" + packageVersion + "']");

// Zip up the dist folder for CDN use
const cdnPkgFilename = "RedGate.HoneycombWebToolkit." + packageVersion + ".zip";
zipFolder("dist", cdnPkgFilename, function(err) {
	if(err) {
		console.error("Failed to zip output package", err);
		process.exit(1);
	} else {
		console.log("Created zipped package");

		// Upload the resulting package to Octopus
		const packagesEndpoint = process.env.OCTOPUS_URL + "/api/packages/raw";

		var octopus_post_form = {
			data: fs.createReadStream(cdnPkgFilename),
		};

		request({
			url: packagesEndpoint,
			method: "POST",
			formData: octopus_post_form,
			headers: {
				"X-Octopus-ApiKey": process.env.OCTOPUS_API_KEY
			}
		}, function(err, response, body) {
			// Upload callback
			if (!err && response.statusCode == 201) {
				console.log("Package uploaded to Octopus");
			} else {
				console.error("Octopus upload failed", err, " status code ", response.statusCode);
				process.exit(1);
			}
		});
	}
});

// Build up the npm-dist folder with stuff we want in the package we send to npmjs.com
if (!fs.existsSync("npm-dist")){
    fs.mkdirSync("npm-dist");
}

// TODO: copy the stuff we want in the npm package into npm-dist
// src and .npmignore and package.json
fs.copySync("src", "npm-dist/src");
fs.copySync(".npmignore", "npm-dist/.npmignore");
fs.copySync("package.json", "npm-dist/package.json");


// Zip up the dist folder
const npmPkgFilename = "RedGate.HoneycombWebToolkit.Npm." + packageVersion + ".zip";
zipFolder("npm-dist", npmPkgFilename, function(err) {
	if(err) {
		console.error("Failed to zip output package", err);
		process.exit(1);
	} else {
		console.log("Created zipped package");

		// Upload the resulting package to Octopus
		const packagesEndpoint = process.env.OCTOPUS_URL + "/api/packages/raw";

		var octopus_post_form = {
			data: fs.createReadStream(npmPkgFilename),
		};

		request({
			url: packagesEndpoint,
			method: "POST",
			formData: octopus_post_form,
			headers: {
				"X-Octopus-ApiKey": process.env.OCTOPUS_API_KEY
			}
		}, function(err, response, body) {
			// Upload callback
			if (!err && response.statusCode == 201) {
				console.log("Package uploaded to Octopus");
			} else {
				console.error("Octopus upload failed", err, " status code ", response.statusCode);
				process.exit(1);
			}
		});
	}
});

console.log("teamcity.js complete");