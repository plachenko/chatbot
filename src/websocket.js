const WebSocket = require('ws');
let ws;

//Connect to websocket server.
exports.connectWS = () =>{
    ws = new WebSocket('ws://localhost:6979');
    ws.addEventListener('open', (e)=>{
        ws = ws;
        // this.send('test');
        console.log('websocket connected.');
    });

    ws.addEventListener('error', (e) => {
      ws.close();
    });

    ws.addEventListener('close', (e)=> {
      setTimeout(this.connectWS, 1000);
    });

    exports.ws = ws;
}

exports.send = (data) => {
  // console.log(data, ws);
  ws.send(data);
}
