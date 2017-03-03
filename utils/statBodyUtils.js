const electron = require('electron');
const electronApp = electron.app || electron.remote.app;

const IPCUtils = require('./ipcUtils');

const StatBodyUtils = {
    getTimestampInUTC:function(){
        let accessTime = new Date()
        return  (new Date(accessTime.getTime()- accessTime.getTimezoneOffset()*60000)).toISOString()
    },
    genUUID:function() {
        let uuid = "", i, random;
        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;

            if (i == 8 || i == 12 || i == 16 || i == 20) {
                uuid += "-"
            }
            uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
    },
    initStatBody:function(appId, userSettings){
        if(!IPCUtils.isRenderer()) {
            let os =  require('os');

            const appName=electronApp ? electronApp.getName() : "";
            const appVersion=electronApp ? electronApp.getVersion() : ""


            return {
                userId: userSettings.userId,
                customId: userSettings.customId || "",
                language: getSystemLocale(),
                appId: appId,
                os: os.platform().replace("darwin", "mac"),
                appMeta: {
                    name: appName,
                    version:  appVersion
                },
                accessTime: this.getTimestampInUTC()
            }
        }else{
            return null;
        }
    },
    getStatBody:function(){
        if(IPCUtils.isRenderer()){
            return electron.remote.getGlobal("NEUTRINO_METRICS_STAT_BODY")
        }else{
            return global.NEUTRINO_METRICS_STAT_BODY;
        }
    }
}

function getSystemLocale(){
    let fullLocale=electronApp.getLocale();
    return fullLocale.split("-")[0] || "";
}


module.exports=StatBodyUtils;