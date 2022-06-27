/*
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
let connected = false;
obs.connect({address: 'localhost:4444'}).then(() => {
  connected = true;
});
*/


// const socket = require('../websocket');

const OSC = require('node-osc');
const Client = OSC.Client;

const Bundle = OSC.Bundle;
const client = new Client('192.168.1.23', 3333);

let lastRolls = [];

const cmdTrigger = "!";
exports.commandTrigger = cmdTrigger;

exports.throw = () => {
  // const bundle = new Bundle([sendChan, sendVal]);
  client.send('/throw', 1);
}

/* -- General Chat Commands -- */
exports.roll = () => {
  const maxRand = 5;
  const n = 100;
  let num = ~~(Math.random() * n);
  while (lastRolls.includes(num)) num = ~~(Math.random() * n);

  lastRolls.push(num)
  lastRolls = lastRolls.slice(maxRand * -1);

  // const num = lastRolls[lastRolls.length - 1];
  // const file = io.audList[num];

  // play(file, user);

  return `You rolled a ${num}`;
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

exports.join = () => {

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

