const electron = require('electron');
const electronApp = electron.app || electron.remote.app;
const IPCUtils = require('./ipcUtils')


// expose the class
const SettingStore =  {
    get(appId) {
        let fs = require('fs');
        let path = require('path');

        let userSettingsPath= path.join(electronApp.getPath('userData'), appId.substring(0, 5) + '.json');

        try{
            return JSON.parse(fs.readFileSync(userSettingsPath));
        }catch(err){
            return false;
        }
    },

    set(appId, userSettings) {

        let fs = IPCUtils.getFsModuleCurrentProcess();
        let path = IPCUtils.getPathModuleCurrentProcess();

        let userSettingsFolder = electronApp.getPath('userData');
        let userSettingsFilePath= path.join(userSettingsFolder, appId.substring(0, 5) + '.json');

        try{
            if (!fs.existsSync(userSettingsFolder)){
                fs.mkdirSync(userSettingsFolder);
            }

            fs.writeFileSync(userSettingsFilePath, JSON.stringify(userSettings));
            return userSettings;
        }catch(err){
            return;
        }
    }
};

module.exports = SettingStore;
