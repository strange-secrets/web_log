# Strange Secrets Web Logging Module
This module can be used in the browser, it captures logged messages and sends them to a
remote server for storage.
It also captures unhandled errors and sends information to a remote server.

This module is still in early development. 

Strange Secrets also provides a web-server that will receive information logged using
this module. Captured errors are also stored within a database and tracked along with
your task management system. For more information please visit the website at
http://strange-secrets.com/red-line

## Installation
The module may be installed into your web application using npm:
```
npm install --save @strangesecrets/web-log
```
## Usage
You may import the library into your ES6+ project using:
```ecmascript 6
import * as SSLog from '@strangesecrets/web-log'
``` 
The module includes typescript type definitions and may be immediately used with
or without typescript.

If you are building with raw ES5 code without module support, you can include the
ES5 source file "" within your build process, the API will be supplied using the SSLog variable.
 
Once imported you should initialize the module for use by your application using the
configure method. The configure method accepts various options allowing you to customize
the behaviour of the module.
```ecmascript 6
SSLog.configure({
    ...options...
});
```
You may specify the following option data when invoking this method:

| Option      | Description                                                                 |
| ----------- | --------------------------------------------------------------------------- |
|uri          | Web address endpoint of your logging server.
|sendDelay    | Frequency (in milliseconds) logging information will be sent to the server  |
|sendCapacity | Maximum number of queued logs to cache before sending to the server         |
|userName     | Name of the user to be associated with the logged information               |
|userId       | Identifier of the user to be associated with the logged information         |
|sessionId    | Identifier of the current session to be associated with the logged information. |
|version      | Version identifier of the application                                       |
|systemLog    | True if logged information should be output to the browser log otherwise false (defaults to true) |
|console      | True (default) to override standard console logging, if false console logging will not be captured. |
|captureErrors| True (default) to capture unhandled exceptions, if false unhandled exceptions will not be logged.| 
  
Only the uri of your logging server is required in order for data to be captured. Defaults
are provided for other options that are omitted.

Once configured, the logging system will capture all console logs and send them to the specified server
unless you have set the 'console' option to false in the configuration options.
