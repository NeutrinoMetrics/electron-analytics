const electron = require('electron');


module.exports={
    isRenderer: isRenderer,
    getFsModuleCurrentProcess:function(){
        if(isRenderer()){
            return electron.remote.require('fs');
        }else{
            return require('fs');
        }
    },
    getPathModuleCurrentProcess:function(){
        if(isRenderer()){
            return electron.remote.require('path');
        }else{
            return require('path');
        }
    },
    getStatsServerConfig:function(){
        if(isRenderer()){
            return electron.remote.getGlobal('NEUTRINO_METRICS_STATS_SERVER_CONFIG')
        }else{
            return global.NEUTRINO_METRICS_STATS_SERVER_CONFIG
        }
    }
}

function isRenderer(){

    if (typeof process === 'undefined'){
        return true
    }

    if (!process) return true;
    if (!process.type) return false;

    return process.type === 'renderer'
}