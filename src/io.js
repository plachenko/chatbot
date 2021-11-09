const fs = require('fs');
const { exec } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const baseDir = `${__dirname}/..`;
const txtDir = `${baseDir}/txt`;
const fileDir = `${baseDir}/files`;

let files = fs.readdirSync(`${fileDir}/audio/`);
exports.fileList = parseFileDir(files);

let secrets = fs.readdirSync(`${fileDir}/_TOPsecret/`);
exports.secretList = parseFileDir(secrets);

let aud;
let unl;
let list;
let sec;

// filter for dotfiles (.gitkeep).
function parseFileDir(list){
    const files = list.filter((e) => {
        if(e.split('.')[0].length == 0){
            return false;
        }
        return true;
    }).map((e) => { return e.split('.')[0] });
    
    return files;
}


/*
function resetList(){
    console.log('reseting');
    secret = fs.readdirSync(`${__dirname}/_TOPsecret/`);
    secList = secret.map((e) => { return e.split('.')[0] });
  
    files = fs.readdirSync(`${__dirname}/audio/`);
    list = files.map((e) => { return e.split('.')[0] });
    dirty = false;
  }
*/

exports.writeTxtFile = (file, data) => {
    fs.writeFileSync(`${txtDir}/${file}.txt`, data)
}

exports.readTxtFile = (file) => {
    return fs.readFileSync(`${txtDir}/${file}.txt`)
}

exports.resetList = () => {
    aud = fs.readdirSync(`${fileDir}/audio/`);
    unl = fs.readdirSync(`${fileDir}/_TOPsecret/`);
    list = aud.map((e) => { return e.split('.')[0] });
    sec = unl.map((e) => { return e.split('.')[0] });
}

exports.relist = (name) =>{
    if(check(name, true)) {
        const ol = path.join(`${fileDir}/_TOPsecret/${name}.mp3`);
        const ne = path.join(`${fileDir}/audio/${name}.mp3`);
        fs.renameSync(ol, ne);
        return true;
    }
    return false;
}

exports.unlist = (name) =>{
    if(check(name)) {
        const ol = path.join(`${fileDir}/audio/${name}.mp3`);
        const ne = path.join(`${fileDir}/_TOPsecret/${name}.mp3`);
        fs.renameSync(ol, ne);
        return true;
    }
    return false;
}

exports.rem = (name) => {
    if(check(name)) {
        fs.rmSync(path.join(`${fileDir}/audio/${name}.mp3`));
        return true;
    }
    return false;
}

exports.rename = (oldN, newN) => {
    if(check(oldN)) {
        const ol = path.join(`${fileDir}/audio/${oldN}.mp3`);
        const ne = path.join(`${fileDir}/audio/${newN}.mp3`);
        fs.renameSync(ol, ne);
        return true;
    }
    return false;
}

function secConv(time1, time2){

    let a = time1.split(':');
    let seconds = (+a[0]) * 60 + (+a[1]);

    seconds += (+time2);
    let minutes = String(Math.floor((+seconds)/60)).padStart(2, '0');
    let secondOffset = String(((+seconds) - minutes * 60)).padStart(2, '0');

    return minutes + secondOffset;
}

exports.check = (name, unlisted = false) =>{
    // resetList();

    exists = unlisted ? this.secretList.indexOf(`${name}`) : this.fileList.indexOf(`${name}`);
    if(exists >= 0){ 
        return true;
    }
    return false;
}

exports.download = (yturl, cmd, range = []) => {
    let exists = files.includes(yturl+'.mp4');
    const url = `https://www.youtube.com/watch?v=${yturl}`;
    const out = `${fileDir}/_reference/${yturl}.mp4`;

    if(exists){
        console.log('file exists.');
        parseAudio(yturl, cmd, range);
    }else{
        console.log('downloading.');
        videofetch(yturl, cmd, range);
    }
}

function parseAudio(audioName, cmdName, range = []) {
    const inp =  path.join(`${fileDir}/_reference/${audioName}.mp4`);
    const out = path.join(`${fileDir}/audio/${cmdName}.mp3`);

    if(!range.length){
        range[0] = '0';
        range[1] = '10';
    }

    let start = range[0];
    let end = secConv(range[0], range[1]);

    start = start
        .replace(':', '')
        .padStart(6, '00')
        .match(/.{1,2}/g)
        .join(':');

    end = end
        .replace(':', '')
        .padStart(6, '00')
        .match(/.{1,2}/g)
        .join(':');

    const cmd = `${ffmpeg} -ss ${start} -to ${end} -i ${inp} ${out}`;
    
    exec(cmd, (error, stdout, stderr) => {
        if(error){
            console.log(`exec error: ${error}`);
            return;
        }
        play(cmdName);
    });
}

function videofetch(ytURL, cmdName, range = []){
    const out = path.join(`${fileDir}/_reference/${ytURL}.mp4`);
    const cmd = `yt-dlp -f worst -S +size,+br --youtube-skip-dash-manifest https://www.youtube.com/watch?v=${ytURL} -o ${out}`;

    exec(cmd, (error, stdout, stderr) => {
        if(error){
            console.log(`exec error: ${error}`);
            return;
        }

        parseAudio(ytURL, cmdName, range);
    });
}

parseYTURL = (u) => {
    const param = u.split('?v=')[1];
    try {
        param.length;
        return param;
    } catch(err) {
        return u;
    }
}

function logCmd(){
    fs.appendFile('log.txt', `\n${now} ${tags.username} - ${msg}`, (err)=>{
        if(err) throw err;
      });
}