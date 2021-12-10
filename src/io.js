const fs = require('fs');
const { exec } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const baseDir = `${__dirname}/..`;
const fileDir = `${baseDir}/files`;

exports.dir = fileDir;

exports.vid = () =>{
    videofetch(ytURL, cmdName, range = [], type = '')
}

function videofetch(ytURL, cmdName, range = [], type = ''){
    const out = path.join(`${fileDir}/_testRef/${ytURL}.webm`);
    const cmd = `yt-dlp -f worst -S +size,+br --youtube-skip-dash-manifest https://www.youtube.com/watch?v=${ytURL} -o ${out}`;

    exec(cmd, (error, stdout, stderr) => {
        if(error){
            console.log(`exec error: ${error}`);
            return;
        }

        switch(type) {
            case 'audio':
                parseAudio(ytURL, cmdName, range);
            case 'video':
                parseVideo(ytURL, cmdName, range);
            default:
                break;
        }
    });
}