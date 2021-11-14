const fs = require('fs');
const io = require('./io');

const socket = require('./websocket');

exports.sendVid = () => {
    const refs = io.refList;
    const fileDir = io.dir;

    const fileName = `test${~~(Math.random()*2)+2}`

    const file = `${fileDir}/video/${fileName}.mp4`;

    const obj = {
        type: 'video',
        payload: {
            name: fileName+'_'+~~(Math.random()*3000),
            buffer: ''
        }
    }

    const stream = fs.createReadStream(file);
    stream.on('data', (e) => {
        obj.payload.buffer = e;
        socket.ws.send(JSON.stringify(obj));
    });
}