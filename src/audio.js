const fs = require('fs');
const Speaker = require('speaker');
const lame = require("@suldashi/lame");
const path = require('path');
const io = require('./io');

// let files = fs.readdirSync(`${__dirname}/_reference/`);

let stream;

let sounds = [];

let speaker;

let exists = false;


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

exports.stop = (killSound) => {
    stop(killSound);
}

exports.volume = (volumeNum, inp) => {
    console.log(check(inp), inp);
    if(check(inp)) {
        const ol = path.join(`${__dirname}/audio/${inp}.mp3`);

        let vol = +volumeNum[0] ? 'volume=0.'+volumeNum[0] : '1.0';
        const cmd = `${ffmpeg} -i ${ol} -filter:a "${vol}" ${ol}`;
        console.log(cmd);

        exec(cmd, (error, stdout, stderr) => {
            if(error){
                console.log(`exec error: ${error}`);
                return;
            }
            console.log(stdout);
        });

        return true;
    }
    
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
    let path = `${__dirname}/../files/audio/`;

    if(unlisted){
        path = `${__dirname}/../files/_TOPsecret/`;
    }

    speaker = new Speaker();

    stream = fs.createReadStream(`${path}${audioName}.mp3`).pipe(new lame.Decoder);
    stream.pipe(speaker);
}
