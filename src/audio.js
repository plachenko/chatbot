const fs = require('fs');
const Speaker = require('speaker');
const lame = require("@suldashi/lame");
const io = require('./io');
const io_bak = require('./_bak/io_bak')
const Volume = require("pcm-volume");

let stream;
let sounds = [];
let decoder;
let vol;
let speaker;
let silent = false;

exports.setSilent = () => {
    silent = !silent;
    return silent;
}

exports.setVolume = (name, unlisted = false, vol = 1) => {

    //ffmpeg -i ak.mp3 -filter:a "volume=0.1" ak1.mp3

}

exports.play = (name, unlisted = false, stopTime) => {
    if(io_bak.check(name, unlisted)) {
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

    vol = new Volume();
    vol.setVolume(1);
    speaker = new Speaker();
    decoder = new lame.Decoder();

    let path = `${__dirname}/../files/audio/`;

    if(unlisted){
        path = `${__dirname}/../files/_TOPsecret/`;
    }

    stream = fs.createReadStream(`${path}${audioName}.mp3`);

    // vol.pipe(speaker);
    // decoder.pipe(vol);
    // stream.pipe(decoder);
    decoder.pipe(speaker);
    stream.pipe(decoder);
}
