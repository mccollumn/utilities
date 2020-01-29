var creds = require('./creds');
var loginStep = 0;

// Login to SharePoint Online
function performLoginSteps()	{
	if (typeof loginSteps[loginStep] == "function")	{
		loginSteps[loginStep]();
		loginStep++;
	}
	if (typeof loginSteps[loginStep] != "function")	{
		return;
	}
}

// Prompt for credentials if not already provided
function getCreds()	{
	if (creds.username == "" || creds.password == "") {
		console.log("\n***************");
		console.log("Login required for " + address + "\n");
		if (creds.username == "") {
			console.log("Enter username:");
			creds.username = system.stdin.readLine();
		}
		else {
			console.log("Using the username already provided: " + creds.username);
		}
		if (creds.password == "") {
			console.log("Enter password:");
			creds.password = system.stdin.readLine();
		}
		else {
			console.log("Using the password already provided.");
		}
		console.log("\n");
	}
}

// Steps for PhantomJS to login to SPO
var loginSteps = [
	function()	{
		console.log("Entering Username: " + creds.username);
		page.evaluate(function(creds) {
			document.getElementsByTagName("input")[0].value = creds.username;
		}, creds);
		page.sendEvent('click');	// Have to click before giving focus to the input box
		page.evaluate(function()	{
			document.getElementsByTagName("input")[0].focus();
			document.getElementsByTagName("input")[0].select();
		});
		page.render('login_username_entered.png');
		page.sendEvent('keypress', page.event.key.Enter);
	},
	function()	{
		console.log("Entering Password");
		page.evaluate(function(creds)	{
			document.getElementsByName("passwd")[0].value = creds.password;
		}, creds);
		
		page.sendEvent('click');	// Have to click before giving focus to the input box
		page.evaluate(function()	{
			document.getElementsByName("passwd")[0].focus();
			document.getElementsByName("passwd")[0].select();
		});
		page.render('login_pw_entered.png');
		page.sendEvent('keypress', page.event.key.Enter);
	},
	function()	{
		//Acknowledge prompt after login
		page.render('login_stay_signed_in.png');
		page.sendEvent('keypress', page.event.key.Enter);
	},
	function()	{
		console.log(page.url); 
		page.render('login_complete.png'); 
	}
];

module.exports = {
	loginSteps: loginSteps,
	getCreds: getCreds,
	performLoginSteps: performLoginSteps
};