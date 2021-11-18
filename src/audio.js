const fs = require('fs');
const Speaker = require('speaker');
const lame = require("@suldashi/lame");
const io = require('./io');

let stream;
let sounds = [];
let speaker;
let silent = false;

exports.setSilent = () => {
    silent = !silent;
    return silent;
}

exports.play = (name, unlisted = false, stopTime) => {
    if(io.check(name, unlisted)) {
        play(name, unlisted);
        if(stopTime){
            setTimeout(()=>{
                stop();
            }, stopTime * 1000);
        }
        return true;
    }
    return false;
};

exports.stop = (killSound = false) => {
    stop(killSound);
}

function playRef(audioName){
    fs.createReadStream(`${__dirname}/_reference/${audioName}.mp3`)
        .pipe(new lame.Decoder)
        .pipe(new Speaker);
}

function stop(killSound){
    stream?.unpipe();
    if(killSound) {
        setTimeout(() => {
            play('america');
        }, 3000);
    }
}

function play(audioName, unlisted = false){
    if(silent) return false;

    let path = `${__dirname}/../files/audio/`;

    if(unlisted){
        path = `${__dirname}/../files/_TOPsecret/`;
    }

    speaker = new Speaker();

    stream = fs.createReadStream(`${path}${audioName}.mp3`).pipe(new lame.Decoder);
    stream.pipe(speaker);
}
