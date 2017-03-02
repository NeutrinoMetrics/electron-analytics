Electron App Analytics Client
=========

Module for Electron apps to feed stats to [NeutrinoMetrics](https://neutrinometrics.net)analytics platform.

## Installation

Using npm:

```bash
$ npm install electron-analytics --save
```


## Usage
In your main process add the following script:  

```javascript
require("electron-analytics").init("<YOUR APP ID>");
```
You can get an auto-generated ID for your app at [NeutrinoMetrics](https://beta.neutrinometrics.net/register).<br><br>
**IMPORTANT** *: Make sure this above code is in your **Main Process**! Check out the electron docs [Main Vs Renderer Process](http://electron.atom.io/docs/tutorial/quick-start/#renderer-process) for more info.


#### Custom Events
After initializing **neutrino** instance, you can send your own custom events.<br>
Works on renderer or main process.
```javascript
const EA = require('electron-analytics');
EA.send("CLICKED_RED_BUTTON");
```

#### Custom User ID
You can also optionally set your own **Custom ID** for your users; run this code after an user logs in.<br>
Works on renderer or main process.
```javascript
const EA = require('electron-analytics');
EA.setCustomUserId("Jane.Smith@gmail.com");

```

## Development Mode
If you do not want to run electron-analytics when developing, add the following node environment variable/value:
```
EA_DISABLE_IN_DEV=true;
```
**Note** *: when running in development, depending on your env setup and location of the electron module, the app name and version can vary.

## Get App ID
In order to start feeding info in your app, generate an ID for your app [here](https://beta.neutrinometrics.net/register). 

## Support
You can email the team at NeutrinoMetrics for support at [info@neutrinometrics.net](mailto:info@neutrinometrics.net) or visit us at [neutrinometrics.net](https://neutrinometrics.net)