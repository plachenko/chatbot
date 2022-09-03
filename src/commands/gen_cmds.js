/*
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
let connected = false;
obs.connect({address: 'localhost:4444'}).then(() => {
  connected = true;
});
*/
const projObj = require('../projects');
const process = require('process');

const  ytsearch = require('youtube-search');
const opts = {
  maxResults: 10,
  key: process.env.YTAPIKEY
}

let screenDim = {
  x: 1920,
  y: 1200
}

const vidList = [];
let videoQueue = [];

let vidReturn = false;

const {google} = require('googleapis');

const crypto = require('crypto');

const {default: OBSWebSocket} = require('obs-websocket-js');
const obs = new OBSWebSocket();
obs.connect('ws://0.0.0.0:4445');

const socket = require('../websocket');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('chatbot.sqlite');

const api = require('./api_cmds');

const OSC = require('node-osc');
const ws = require('../websocket');
const Client = OSC.Client;

const locClient = new Client('0.0.0.0', 3332);
const client = new Client('0.0.0.0', 3333);

let lastRolls = [];

let curProject = 'it';

const cmdTrigger = "!";
exports.commandTrigger = cmdTrigger;

/*
const hash = crypto.createHash('sha256');
hash.on('readable', ()=>{
  const data = hash.read();
  if(data){
    console.log(data.toString('hex').substring(4))
  }
})
*/

/*
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
(async () => {

  console.log('test');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://youtube.com/results?search_query=hello', {waitUntil: 'domcontentloaded'});
  console.log();
  let $ = cheerio.load(await page.content());
  console.log($('.contents').children());

  // await page.screenshot({path: 'example.png'});

  await browser.close();
})();

*/

exports.throw = () => {
  locClient.send('/throw', '');
  client.send('/throw', 'test');
}

function getCaptions(vID){
  google.youtube('v3').captions.list({
    key: process.env.YTAPIKEY,
    part: 'id',
    videoId: vID
  }).then((res)=>{
    const captionID = res.data.items[0].id;
    console.log(captionID);
    const captionURL = `https://youtube.googleapis.com/youtube/v3/captions/${captionID}?key=${process.env.YTAPIKEY}`;
    fetch(captionURL, {
      headers: new Headers({
        'Authorization': 'Bearer '+process.env.YTOAUTH,
        'Accept': 'application/json'
      })
    }).then((res)=>{
      return res.json();
    }).then((data) => {
      console.log(data);
    });
    /*
    google.youtube('v3').captions.download({
      key: process.env.YTAPIKEY,
      id: captionID
    }).then((e) => {
      console.log(e);
    });
    */
  });
}

function checkYoutubeAPI(args, keepList = false){
  let urlID;
  return google.youtube('v3').search.list({
    key: process.env.YTAPIKEY,
    part: 'snippet',
    q: args
  }).then((res) => {
    // console.log(res.data.items);
    const ytlist = res.data.items;
    
    urlID = ytlist.find((el) => {
      return el.id.kind == 'youtube#video';
    });
    
    addBrowserItem(urlID.id.videoId);

    // getCaptions(urlID.id.videoId);

    return urlID.id.videoId;

  }).catch((err) => console.log(err));
}

function sendWS(MsgType, payload){
  const obj = {
    type: MsgType,
    payload: {
      id: payload,
    }
  }
  socket.ws.send(JSON.stringify(obj));
}

exports.dimCheck = function(){
  getDimensions();
}

exports.clearVids = (args) => {
  const num = args[0];
  getMemeSceneItems(num);
}

async function getMemeSceneItems(num){
  const itemList = await obs.call('GetSceneItemList', {
    sceneName: 'videos',
  });
  
  const list = itemList.sceneItems.filter((el) => el.sourceName.substring(0, 4) == 'meme' && el.sourceName.length > 5);
  
  if(!list.length) return;

  list.forEach((el, idx) =>{
    if(idx < list.length - num) return;
    obs.call('RemoveSceneItem', {sceneName: 'videos', sceneItemId: el.sceneItemId});
  });
  videoQueue = num ? list.slice(list.length-num) : [];
}

async function getDimensions(){
  const settings = await obs.call('GetVideoSettings');
  screenDim.x = settings.baseWidth;
  screenDim.y = settings.baseHeight;
}

exports.penis = () => {
  let lngt = ~~(Math.random()*71);
  return `8=${'='.repeat(lngt)}D wow ${lngt} long!`;
}

function addBrowserItem(urlID){
  const hash = crypto.createHash('md5').update(urlID+Math.random()).digest('hex').substring(0, 5);
  let srcname = `meme${hash}`;

  const scaleNum = 10;
  
  obs.call('CreateInput', {
    sceneName: 'videos', 
    inputName: srcname,
    inputKind: 'browser_source',
    // sceneItemEnabled: false,
    inputSettings: {
      // reroute_audio: true,
      width: (screenDim.x / scaleNum)  + screenDim.x,
      height: (screenDim.y / scaleNum) + screenDim.y - 15,
      shutdown: true,
      url: `http://${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}?id=${urlID}`
    }
  }).then((e) => {
    obs.call('SetSceneItemTransform', {
      sceneName: 'videos',
      sceneItemId: e.sceneItemId,
      sceneItemTransform: {
        positionX: -96,
        positionY: -54
      }
    })
    obs.call('CreateSourceFilter', {
      sourceName: srcname,
      filterName: 'Chroma Key',
      filterKind: 'chroma_key_filter_v2'
    });
  });

  // Send urlID to the websocket connection to be injested by browser
  sendWS(urlID);
}

const ytRegex = /(.*?)(^|\/|v=)([a-z0-9_-]{11})(.*)?/im;
// let randVid = false;
exports.yt = async (args) => {
  
  if(vidList.length){
    // console.log(vidList);
    // return;
  }

  // Check if there are arguments and they're well formed
  if(!args.length) {
    // randVid = true;
    let words = [
      'ice',
      'know',
      'mastermind',
      'ivory',
      'freckle',
      'extract',
      'conglomerate',
      'self',
      'tent',
      'lost',
      'mutation',
      'health',
      'agile',
      'make',
      'noise',
      'feeling',
      'parallel',
      'decay',
      'heaven',
      'investment',
      'tribute',
      'forge',
      'cottage',
      'echo',
      'plain',
      'fragrant',
      'steward',
      'ceremony',
      'drain',
      'diamond'
    ];

    for(let i = 0; i <= Math.floor(Math.random() * 4) ; i++){
      args.push(words[Math.floor(Math.random() * (words.length-1))]);
    }
  }

  // if search string or if the yt id regex doesn't hit
  if(args.length > 1 || !ytRegex.test(args[0])){
    // if a generalized string, use the youtube search api
    const vidID = await checkYoutubeAPI(args.join(' '));
    if(!vidReturn) return;
    return `playing https://www.youtube.com/watch?v=${vidID}`;
  } else {
    // add the browser item with the youtube id directly.
    addBrowserItem(args[0]);
  }
}

exports.cohost = () => {
  return `Cohost is ${cohost} go check them out!`;
}

exports.showClip = () => {
  if(!api.lastClipURL) return `No Clip!`;
  locClient.send('/showClip', api.lastClipURL);
}

/* -- General Chat Commands -- */
exports.roll = () => {
  const maxRand = 5;
  const n = 100;
  let num = ~~(Math.random() * n);
  while (lastRolls.includes(num)) num = ~~(Math.random() * n);

  lastRolls.push(num);
  lastRolls = lastRolls.slice(maxRand * -1);

  // const num = lastRolls[lastRolls.length - 1];
  // const file = io.audList[num];

  // play(file, user);

  return `You rolled a ${num}`;
}

function setProject(name){
  // console.log(name);
  curProject = name.title;
}

exports.project = () => {
  projObj.getProject(setProject);

  return `working on ${curProject}!`;
};

exports.peepoLeave = () => {
  obs.call('SetSceneItemEnabled', {
    sceneName: 'ComputerRoom',
    sceneItemId: 12,
    sceneItemEnabled: true
  });
}

exports.setProjectTitle = (project = null) => {
  if(!project) return;
  
  projObj.addProject(project);

  curProject = project;
  return `setting project to ${curProject}!`;
}

exports.cans = () => {
  // console.log('knocking.');
  client.send('/knockCans', 1);
}

exports.shotgun = () => {
  locClient.send('/throw', 'shotgun');
  client.send('/throw', 'shotgun');
}

exports.lurk = () => {
  return "what? who's there?"
}

exports.barrelRoll = () => {
  const obj = {
    type: 'msg',
    payload: 'barrelRoll'
  }

  socket.ws.send(JSON.stringify(obj));
}

exports.sendTTS = (test) => {
  console.log('sending TTS',test);
}

exports.showDiscord = () => {
  return 'Chill discord (moist lyfe) https://discord.gg/UbVt5PKZqH | Game Jamming / Making https://discord.gg/sKF2nTa3qk';
}

exports.showBroke = () => {
  return 'plnrnd plz fix ur stuff! D:';
}

exports.showMon = (num) => {
  if(!connected) return;
  obs.send('SetCurrentScene', {
    'scene-name': 'sceneMon'+num
  }).catch(e => {
      console.log('error',e);
  });
}

exports.showHelp = () => {
  let ret = `This bot has a few options like aliasing multiple commands to a label (like an emote or a text phrase). \n
  use '${cmdTrigger}[command] [label/emote]' \n
  You can play last command with '${cmdTrigger}!' \n
  remove aliases with '${cmdTrigger}- [label]' \n
  check commands listed with a label with '${cmdTrigger}?'
  Commands can be listed with ${cmdTrigger}c
  source code for backend is available here: https://www.github.com/plachenko/chatbot
  source code for frontend is available here: https://www.github.com/plachenko/streamFrontend`;
  return ret;
}

exports.showCommands = (args = []) => {
  let ret = false;
  let cmdList = [];

  /*
  if(args[0] == 'text'){
      ret = `${io.audList.length} commands - ${cmdTrigger}${io.audList.join(' ' + cmdTrigger)}`;
  }
  */

  if(cmdList.length){
    ret = `${cmdList.length} command${cmdList.length > 1 ? 's' : ''} - ${cmdTrigger}${cmdList.join(' '+cmdTrigger)}`;
  } else {
    ret = 'No commands.';
  }

  /*
  const obj = {
      type: 'commands',
      list: list
  }
  ws.send(JSON.stringify(obj));
  */

  return ret;
}