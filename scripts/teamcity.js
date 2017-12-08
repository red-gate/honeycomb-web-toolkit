// Extra tasks when building on TeamCity.
const pkg = require('../package.json');

// Check we have the BUILD_COUNTER environment variable set - if not, we're probably not running in TC, or
// it's got lost from the env.* parameters (should be set to %build.counter%)
if (!process.env.BUILD_COUNTER) {
	console.error("BUILD_COUNTER environment variable not set: ensure TeamCity project is configured to set this to %build.counter%.");
	process.exit(1);
}

// Set the build version from package.json, plus the build counter to uniquify it
console.log("Build number set OK");
console.warn("##teamcity[buildNumber '" + pkg.version + "." + process.env.BUILD_COUNTER + "']");

console.log("teamcity.js complete");