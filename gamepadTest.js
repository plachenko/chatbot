const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
obs.connect({address: 'localhost:4444'}).then(() => {
  connected = true;
  // console.log('connected to obs!');
    obs.send('SetSceneItemProperties', {
    'item': 'Dell',
    'visible' : false
    }).catch((err) => {
      console.log(err);
    });

}).catch(err =>{
  console.log(err);
});


/*
var osc = require("osc"),
    OBSWebSocket = require('obs-websocket-js'),
    WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8080});
let ws = null;
wss.on('connection', (_ws) =>{
    ws = _ws;
    ws.send('hello!');
});

const obs = new OBSWebSocket();
let connected = false;
obs.connect({address: 'localhost:4444'}).then(() => {
    connected = true;
    console.log('connected to obs!');
}).catch(err =>{
    console.log(err);
});

obs.on('error', err => {
    console.error('socket error:', err);
});
*/
/*
var getIPAddresses = function () {
    var os = require("os"),
        interfaces = os.networkInterfaces(),
        ipAddresses = [];
    for (var deviceName in interfaces) {
        var addresses = interfaces[deviceName];
        for (var i = 0; i < addresses.length; i++) {
            var addressInfo = addresses[i];
            if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }
    return ipAddresses;
};
udpPort.on("ready", function () {
    var ipAddresses = getIPAddresses();
    console.log("Listening for OSC over UDP.");
    ipAddresses.forEach(function (address) {
        console.log(" Host:", address + ", Port:", udpPort.options.localPort);
    });
});
*/
/*
var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 7000
});
let out = true;

udpPort.on("message", function (oscMessage) {
    // console.log(oscMessage);
    if(oscMessage.address == "/Area_1" && connected) {
        if(oscMessage.args[0] > 0 && oscMessage.args[0] < 1){
            if(out){
                console.log('changing scene out!');

                obs.send('SetCurrentScene', {
                    'scene-name': 'Camera1'
                }).catch(e => {
                    console.log('error',e);
                });

                out = false;

            }
        }else{

           if(!out){
                wss.clients.forEach((client) => {
                    client.send('exit');
                });

                console.log('changing scene in!');

                setTimeout(()=>{
                    obs.send('SetCurrentScene', {
                        'scene-name': 'Laptop'
                    }).catch(e => {
                        console.log('error',e);
                    });
                }, 400);

                out = true;
           }

        }
    }
});


udpPort.open();
// let i = 0;

// udpPort.on("ready", () =>{
//     setInterval(() => {
//         console.log('sending.', i);
//         udpPort.send({
//             address: "/ch/1",
//             args:[
//                 {type: "i", value: i++}
//             ]
//         }, "127.0.0.1", 7006);
//     }, 1000);
// })

udpPort.on("error", function (err) {
    console.log(err);
});
*/
