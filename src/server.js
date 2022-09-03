const WebSocket = require('ws');
const fs = require('fs');
const WebSocketServer = WebSocket.WebSocketServer;
const { Readable } = require('stream');
const OSCServer = require('node-osc').Server;
const game = require('./commands/game_cmds');

// const io = require('./io_bak');
const audio = require('./audio');
const wsClients = [];
const bot = require('./bot');

const video = require('./_bak/video');

const oscServ = new OSCServer(3334, '0.0.0.0', () => {
	// console.log('started');
});

oscServ.on('message', (e)=>{
	// console.log(e);
});

const wss = new WebSocketServer({
	port: 6979,
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
	let obs = req.url.slice(1) == 'obs';

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

	// on a websocket message...
	ws.on('message', (data, isBinary)=>{
		
		// Parse the data
		const objParse = JSON.parse(data.toString());
		// console.log(objParse);

		// Check for HONK command
		if(objParse.type == 'honk'){
			const honking = objParse.payload;
			if(honking){
				game.starthonk();
			} else {
				game.endHonk();
			}
		}

		// Check for COUNTER command for death counter.
		if(objParse.type == 'counter'){
		// audio.play('america');
		}

		if(objParse.type == 'cmd'){
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
