const WebSocket = require('ws');
let ws;

//Connect to websocket server.
exports.connectWS = () =>{
    ws = new WebSocket('ws://localhost:6969');
    ws.addEventListener('open', (e)=>{
        this.ws = ws;
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
