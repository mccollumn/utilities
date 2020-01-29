var config = require('./config');

// Called every time a resource is requested, and check if it is one we care about
onResourceRequested = function (res) {
	var length = config.resources_to_log.length;
	while(length--) {                
		if (config.resources_to_log[length].test(res.url)){
			console.log(res.url);
			fs.write(outputFile, res.url + "\n", "a");
		}
	}
};

// Log errors if DEBUG = true
onError = function(msg, trace){
	if (DEBUG) {
		console.log('ERROR: ' + msg)
		console.log(trace)
	}
};

// Record errors loading resources
onResourceError = function(resourceError) {
	page.reason = resourceError.errorString;
	page.reason_url = resourceError.url;
};

// Log console messages if CONSOLE_LOG = true
onConsoleMessage = function(msg) {
	if (CONSOLE_LOG)	{
		console.log("Console: " + msg);
	}
};

module.exports = {
	onResourceRequested: onResourceRequested,
	onError: onError,
	onResourceError: onResourceError,
	onConsoleMessage: onConsoleMessage
}