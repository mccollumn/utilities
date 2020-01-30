/*
* Loads a list of page URLs and records the specified resources that were loaded (e.g. calls to WT).
* Inspired by this solution: https://www.distilled.net/resources/using-phantomjs-to-monitor-google-analytics/
*
* Usage:
* phantomjs --ssl-protocol=any trackingValidate.js pages.txt
*
* v1.5 1/28/2020
* Nick M.
*/

var page = require('webpage').create(),
    system = require('system'),
	fs = require('fs'),
	config = require('./config'),
	spoLogin = require('./spoLogin'),
	handlers = require('./handlers');

const WAIT_TIME = config.settings.WAIT_TIME; 
const MAX_EXECUTION_TIME = config.settings.MAX_EXECUTION_TIME; 
const LOGIN_WAIT_TIME = config.settings.LOGIN_WAIT_TIME;
const DEBUG = config.settings.DEBUG;
const CONSOLE_LOG = config.settings.CONSOLE_LOG;

var address;
var pages;
var pageCount = 0;
var outputFile = "results.txt";

// Read each line of the pages file into an array
function readTextFile(file)	{
	if (!fs.exists(file))	{
		console.log("Pages file not found.");
		console.log('Usage: trackingValidate.js <path to pages file>');
		phantom.exit(1);
	}
	if (!fs.isReadable(file))	{
		console.log("Cannot read pages file.");
		phantom.exit(1);
	}
	
	var fileText = fs.read(file);
	return fileText.split("\n");
}

// Open a page and wait for all resources to load
function loadPage(address)	{
	try {
		var waitTime = WAIT_TIME;
		console.log("\nPage: " + address);
		fs.write(outputFile, "\n" + address + "\n", "a");
		fs.write(outputFile, "Requests:\n", "a");
		page.open(address, function (status) {
			if (status !== 'success') {
				console.log("FAILED: to load " + address);
				console.log(page.reason_url);
				console.log(page.reason);
				fs.write(outputFile, "Failed to load page: " + address + "\n", "a");
				
				setTimeout(function () {
					pageCount++;
					nextPage();
				}, waitTime);
			} else {
				if (address != page.url){
					
					// We got redirected to the SPO login page so start login process
					if (page.url.indexOf("login.microsoftonline.com") != -1)	{
						spoLogin.getCreds();
						waitTime += LOGIN_WAIT_TIME;
						var interval = setInterval(spoLogin.performLoginSteps, config.settings.LOGIN_WAIT_TIME / spoLogin.loginSteps.length);
					}
					else {
						console.log("Redirected to this URL: " + page.url);
						fs.write(outputFile, "Redirected to this URL: " + page.url + "\n", "a");
					}
				}
				setTimeout(function () {
					pageCount++;
					nextPage();
				}, waitTime);
			}
		});
	} catch(err) {
		console.log("FAILED: to load " + address);
		console.log(err);
		fs.write(outputFile, "Failed to load page: " + address + "\n", "a");
	} finally {
		if (MAX_EXECUTION_TIME > 0) {
			// If still running after MAX_EXECUTION_TIME something is wrong so exit
			setTimeout(function() {
				console.log("FAILED: Max execution time " + Math.round(MAX_EXECUTION_TIME) + " seconds exceeded");
				phantom.exit(1);
			}, MAX_EXECUTION_TIME);
		}
	}
}

// If there are more pages to load then load them, otherwise exit
function nextPage()	{
	if (pageCount >= pages.length)	{
		phantom.exit(0);
	}
	address = pages[pageCount].toString().trim();
	loadPage(address);
}

// Make sure a pages file was specified
if (system.args.length === 1) {
    console.log('Usage: trackingValidate.js <path to pages file>');
    phantom.exit(1);
} else {
	
	// Read list of pages
	var filePath = system.args[1];
	pages = readTextFile(filePath);
	
	// Write output file heading
	var d = new Date();
	fs.write(outputFile, d + "\n", "w");
	fs.write(outputFile, page.settings.userAgent + "\n\n", "a");
	
	// Attach handlers
	page.onResourceRequested = handlers.onResourceRequested;
	page.onError = handlers.onError;
	page.onResourceError = handlers.onResourceError;
	page.onConsoleMessage = handlers.onConsoleMessage;
	
	// Start loading pages
	nextPage();
}