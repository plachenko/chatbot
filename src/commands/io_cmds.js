const fs = require('fs');
const { exec } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const baseDir = `${__dirname}/../..`;
const fileDir = `${baseDir}/files`;

// console.log(fileDir)

let files = fs.readdirSync(`${fileDir}/video`);

exports.dir = fileDir;

exports.addCmd = () => {
  console.log('adding.');
  // Start by checking if command exists.


  // then download the video

  // then parse the crop

  // then store the crop and play it
}

exports.removeCmd = () => {

}

exports.editCmd = () => {

}

exports.toggleListed = () => {

}

function download(yturl, cmd, range = [], type){
  let exists = audio.includes(yturl+'.mp4');
  const url = `https://www.youtube.com/watch?v=${yturl}`;
  const out = `${fileDir}/_reference/${yturl}.mp4`;

  if(exists){
      console.log('file exists.');
      parseAudio(yturl, cmd, range, type);
  }else{
      console.log('downloading.');
      videofetch(yturl, cmd, range, type);
  }
}

function parseRange(range){
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

  return [start, end];
}

function parseVideo(videoName, cmdName, range = [], filters = {}) {
  const inp =  path.join(`${fileDir}/_reference/${videoName}.mp4`);
  const out = path.join(`${fileDir}/video/${cmdName}.mp3`);

  const timeRange = parseRange(range);

  let filtersString = '';

  if(filters.chroma){
      filtersString = `
      -f lvfi
      -i color=c=#00000000
      -i ${inp}
      -c: png
      -filter_complex "[1:v]chromakey=0x00FF00:similarity=.3[out]"
      -map "[out]"`;
  }

  const cmd = `
      ${ffmpeg}
      -ss ${timeRange[0]} -to ${timeRange[1]}
      ${filtersString}
      -c:v libvpx-vp9
      -crf 30
      -b:v 0
      -an
      ${out}`;

  /*ffmpeg
      -f lavfi
      -i color=c=#00000000
      -i go.mp4
      -c: png
      -filter_complex "[1:v]chromakey=0x00FF00:similarity=.3[out]"
      -map "[out]"
      -c:v libvpx-vp9
      -crf 30
      -b:v 0
      -an testGreen3.webm*/

  processing = true;

  exec(cmd, (error, stdout, stderr) => {
      if(error){
          console.log(`exec error: ${error}`);
          return;
      }
      // play(cmdName);
      process = false;
  });
}

function videofetch(ytURL, cmdName, range = [], type = ''){
  const out = path.join(`${fileDir}/_reference/${ytURL}.mp4`);
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

parseYTURL = (u) => {
  const param = u.split('?v=')[1];
  try {
      param.length;
      return param;
  } catch(err) {
      return u;
  }
}
