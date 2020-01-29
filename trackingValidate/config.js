// Resource URLs to log when they are loaded
var resources_to_log = [
	new RegExp('^http(s)?://statse\.webtrendslive\.com.*'),
	new RegExp('^http(s)?://scs\.webtrends\.com.*')
];

var settings = {
	WAIT_TIME: 10000,				// Time to wait for page load (ms)
	MAX_EXECUTION_TIME: 0,			// Total time to wait before aborting (ms), 0 for disabled
	LOGIN_WAIT_TIME: 30000,			// Time to wait for SPO login to complete (ms)
	DEBUG: false,					// Output error messages to console
	CONSOLE_LOG: false				// Output console messages
};

module.exports = {
	resources_to_log: resources_to_log,
	settings: settings
};