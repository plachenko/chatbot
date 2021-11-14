const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
const fs = require('fs');
const io = require('./io');

obs.connect({ address: 'localhost:4444' }).then(()=>{
    console.log('connected.');
});

exports.playVid = () => {
    const refs = io.refList;
    const fileDir = io.dir;
    const file = `${fileDir}/_reference/${refs[15]}.mp4`;

    console.log(file);
    obs.send('AddSceneItem', {'scene-name': 'test', 'source-name': 'MediaSource'});
}