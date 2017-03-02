'use strict';

const electron = require('electron')

const HttpHelper = require('./utils/httpHelper')
const StatBodyUtils = require('./utils/statBodyUtils');
const IPCUtils = require('./utils/ipcUtils');
const SettingStore = require('./utils/settingStore')

const config = require("./config.js").get();
const HOST_URL = config.statsServer.host
const HOST_PORT = config.statsServer.port
const UPDATE_INTERVAL = config.updateInterval



module.exports = {
    /**
     *
     * @param {string} appId
     * @return {string}
     */
    init:function(appId){

        if(appId && !IPCUtils.isRenderer() && process.env.EA_DISABLE_IN_DEV!=="true" ){
            global.NEUTRINO_METRICS_APP_ID=appId;

            let userSettings = SettingStore.get(appId);
            if(!userSettings){
                userSettings = SettingStore.set(appId, {
                    userId: StatBodyUtils.genUUID()
                });

                if(!userSettings) return;
            }

            let statBody = StatBodyUtils.initStatBody(appId, userSettings);
            global.NEUTRINO_METRICS_STAT_BODY=statBody;

            setInterval(updateSession, UPDATE_INTERVAL);
        }
    },
    send:function(eventName){
        let statBody=StatBodyUtils.getStatBody()
        if(statBody){
            HttpHelper.request(HOST_URL, HOST_PORT, "event", "POST",
                {
                    userId:statBody.userId,
                    customId:statBody.customId,
                    appId:statBody.appId,
                    event: eventName,
                    timestamp: StatBodyUtils.getTimestampInUTC()
                }
            )
        }

    },
    setCustomUserId:function(customId){

        let statBody=StatBodyUtils.getStatBody();

        if(statBody){
            HttpHelper.request(HOST_URL, HOST_PORT, "project/user", "PUT",
                {
                    userId:statBody.userId,
                    customId:customId,
                    appId:statBody.appId
                }, function (status) {
                    if(status===200 && SettingStore.set(statBody.appId, {userId:statBody.userId, customId: customId})){
                        statBody.customId = customId;
                        if(IPCUtils.isRenderer()){
                            electron.remote.getGlobal('NEUTRINO_METRICS_STAT_BODY').customId = customId
                        }else{
                            global.NEUTRINO_METRICS_STAT_BODY.customId=customId;
                        }

                    }
                }
            )
        }
    }
}

function updateSession(){
    if(!IPCUtils.isRenderer()){
        let statBody = global.NEUTRINO_METRICS_STAT_BODY;
        statBody.accessTime= StatBodyUtils.getTimestampInUTC()
        HttpHelper.request(HOST_URL, HOST_PORT, "", "POST", statBody)
    }
}


