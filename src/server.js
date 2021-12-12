const WebSocket = require('ws');
const fs = require('fs');
const WebSocketServer = WebSocket.WebSocketServer;
const { Readable } = require('stream');

// const io = require('./io_bak');
// const audio = require('./audio');
const wsClients = [];
const bot = require('./bot');

const video = require('./_bak/video');

const wss = new WebSocketServer({
	port: 6969,
});

function heartbeat() {
	this.isAlive = true;
}

function bufferToStream(buffer){
  let stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

async function saveVideo(_blob){
  const writeStream = fs.createWriteStream(`${__dirname}/file.webm`);

  // const blob = _blob;

  // const arrayBuffer = await blob.arrayBuffer();
  console.log(_blob.buffer);
  const array = new Uint8Array(_blob.buffer);
  const readStream = bufferToStream(array);
  readStream.pipe(writeStream);
  return;
  // const arrayBuffer = JSON.parse(_blob);
  // const array = new Uint8Array(arrayBuffer);
  // const buffer = Buffer.from(array);
  // const readStream = bufferToStream(buffer);
  // readStream.pipe(writeStream);
}

const interval = setInterval(function ping() {
	wss.clients.forEach(function each(ws) {
		if (ws.isAlive === false){
			console.log('terminated');
			return ws.terminate();
		}

		ws.isAlive = false;
		ws.ping();
	});
}, 30000);

wss.on('connection', (ws, req) => {
	let obs = req.url.slice(1) == 'true';

	wsClients.push({id: req.headers['sec-websocket-key'], client: ws, obs: obs});

	ws.isAlive = true;
	ws.on('pong', heartbeat);

	if(!obs){
		/*
		const obj = {
			type: 'cmdBtns',
			payload: io.audList
		};

		ws.send(JSON.stringify(obj));
		*/
	}

	ws.on('message', (data, isBinary)=>{
    const obj = data;
    console.log(isBinary);
    console.log(obj);
    saveVideo(obj);
    return;
		// const obj = JSON.parse(data.toString());

		if(obj.type == 'cmd'){
			const cmd = obj.payload;
      if(cmd == 'saveVid'){
        // saveVideo();
      }

			if(cmd == 'sendVid'){
				video.sendVid();
				return;
			}

			if(cmd == 'random'){
				bot.rollCmd();
				return;
			}
			// audio.play(obj.payload);
		}

		wss.clients.forEach((client)=>{
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
		});
	});
});

wss.on('close', (ws) => {
	clearInterval(interval);
});

exports.wss = wss;
