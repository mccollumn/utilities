ParamsToCSV.exe generates a list of all parameters (and an example alue for each) found within the specified log files.

Usage:
ParamsToCSV.exe <log files to analyze>

---------------------------------------

ParamsToCSV.exe utilizes functionality from Microsoft Log Parser 2.2, and therefore LogParser.dll must be registered in Windows.  There are two ways to do this.

Option 1:

Download and install Log Parser 2.2
https://www.microsoft.com/en-us/download/details.aspx?id=24659


Option 2:

Manually register the LogParser.dll file included in this zip.

Open a command prompt as an administrator, and type:
    regsvr32 <path>\LogParser.dll
