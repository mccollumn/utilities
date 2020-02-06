This utility loads a list of page URLs and records the specified resources that were loaded (e.g. calls to WT).

Usage:
 -Edit "pages.txt".
 -Enter a list of all pages to test, one per line.
 -Run "trackingValidate.bat".
 -Results are output to "results.txt".
 -A list of pages that made no requests is output to "notracking.txt".

If testing SharePoint Online pages, credentials will need to be provided.
 -Edit "creds.js" and enter the username and password.
 -Or enter credentials when prompted.

"config.js" contains user configurable settings, such as:
 -What resource requests to log.
 -The amount of time to wait for the resources to load.
 -Debug options.