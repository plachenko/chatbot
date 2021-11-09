const WebSocket = require('ws');
const WebSocketServer = WebSocket.WebSocketServer;
const fs = require('fs');

const wss = new WebSocketServer({
	port: 6969,
});

exports.wss = wss;

wss.on('videoRequest', (data)=>{
	console.log(data);
});

wss.on('connection', (ws) => {
	ws.on('message', (data, isBinary)=>{
		wss.clients.forEach((client)=>{
            if (client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
		});
	});
});