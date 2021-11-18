const fs = require('fs');
const io = require('./io');
const crypto = require('crypto');

const socket = require('./websocket');

socket.connectWS();

exports.sendVid = () => {
    const refs = io.refList;
    const fileDir = io.dir;

    // const fileName = `test${~~(Math.random()*3)+1}`;
    const fileName = `output${~~(Math.random()*4)+2}`;
    // const fileName = `output2`;

    const file = `${fileDir}/video/${fileName}.webm`;

    const obj = {
        type: 'video',
        payload: {
            name: fileName+'_' + crypto.randomBytes(2).toString('hex'),
            buffer: ''
        }
    }

    const stream = fs.createReadStream(file, { highWaterMark: 10000 * 1024 });
    stream.on('data', (e) => {
        obj.payload.buffer = e;
        // console.log(e);
        socket.ws.send(JSON.stringify(obj));
    });
}