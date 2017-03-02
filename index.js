'use strict';

const electron = require('electron')

const HttpHelper = require('./utils/httpHelper')
const StatBodyUtils = require('./utils/statBodyUtils');
const IPCUtils = require('./utils/ipcUtils');
const SettingStore = require('./utils/settingStore')

const config = require("./config.js").get();

module.exports = {
    init:function(appId){

        if(appId && !IPCUtils.isRenderer() && process.env.EA_DISABLE_IN_DEV!=="true" ){
            global.NEUTRINO_METRICS_APP_ID=appId;
            global.NEUTRINO_METRICS_STATS_SERVER_CONFIG ={
                host: config.statsServer.host,
                port: config.statsServer.port,
                updateInterval: config.updateInterval
            }

            let userSettings = SettingStore.get(appId);
            if(!userSettings){
                userSettings = SettingStore.set(appId, {
                    userId: StatBodyUtils.genUUID()
                });

                if(!userSettings) return;
            }

            let statBody = StatBodyUtils.initStatBody(appId, userSettings);
            global.NEUTRINO_METRICS_STAT_BODY=statBody;

            setInterval(updateSession, config.updateInterval);
        }
    },
    send:function(eventName){
        let statsServerConfig = IPCUtils.getStatsServerConfig()
        let statBody=StatBodyUtils.getStatBody()
        if(statBody){
            HttpHelper.request(statsServerConfig.host, statsServerConfig.port, "event", "POST",
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
        let statsServerConfig = IPCUtils.getStatsServerConfig()

        if(statBody && customId!==statBody.customId){
            HttpHelper.request(statsServerConfig.host, statsServerConfig.port, "project/user", "PUT",
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
        let statsServerConfig = IPCUtils.getStatsServerConfig();
        let statBody = global.NEUTRINO_METRICS_STAT_BODY;

        statBody.accessTime= StatBodyUtils.getTimestampInUTC()
        HttpHelper.request(statsServerConfig.host, statsServerConfig.port, "", "POST", statBody)
    }
}


