const IPCUtils = require('./utils/ipcUtils')

const internal={
    statsServer:{
        host:"127.0.0.1",
            port:3002
    },
    updateInterval: 8000
}

const production={
    statsServer:{
        host:"34.195.107.11",
            port:3002
    },
    updateInterval: 30000
}

module.exports={
    get:function(){
        if(!IPCUtils.isRenderer() && process.env.EA_INTERNAL_DEV==="true"){
            return internal;
        }else{
            return production;
        }
    }
}

