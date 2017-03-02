const IPCUtils = require('./ipcUtils');
let http;

if(!IPCUtils.isRenderer()){
    http = require('http')
}

module.exports={
    request: IPCUtils.isRenderer() ? requestInRenderer:requestInMain
}

function requestInMain(url, port, path, method, body={}, callBack=null){
    if(IPCUtils.isRenderer()){
        return;
    }

    const postData=JSON.stringify(body)

    const options = {
        host: url,
        port: port,
        path: "/"+path,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, callBack ? function(response){
            // Continuously update stream with data
            var body = '';
            response.on('data', function(d) {
                body += d;
            });

            response.on('end', function(){
                callBack(this.statusCode)
            });
    }:null);

    req.on('error', function(e){
        console.log(e);
        callBack(this.statusCode);
    });

    req.write(postData);
    req.end();

}

function requestInRenderer(url, port, path, method, bodyJson={}, callBack=null){
    if(!IPCUtils.isRenderer()){
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open(method, `http://${url}:${port}/${path}`);

    if(method !== "GET"){
        xhr.setRequestHeader('Content-Type', 'application/json');
    }
    xhr.onload = function () {
        if (this.status >= 200 && this.status <= 304) {
            if(callBack){
                callBack(this.status)
            }
        }
    };

    xhr.onerror = function () {};

    try{
        xhr.send(JSON.stringify(bodyJson));
    }catch(err){
    }
}