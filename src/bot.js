const io = require('./io');
const audio = require('./audio');
const video = require('./video');
const extra = require('./extras');
// const obs = require('./obs');
const socket = require('./websocket');

const cmdTrigger = "!";
let lastRolls = [];
let users = [];
let global = {
  nocmd: false,
  silent: false,
  streakmode: false,
  noviz: false,
  verbose: true,
  cmds: []
};
let cmdArr = [];


exports.cmdTrigger = cmdTrigger;
exports.channel = '';

process.on('uncaughtException', (err)=>{
  console.log(err);
});


function sendCmdBtns(){
  const obj = {
    type: 'cmdBtns',
    payload: io.audList
  };

  socket.ws.send(JSON.stringify(obj));
}

// On bot start
exports.start = () => {
  
  // socket.connectWS();

  socket.ws.addEventListener('open', ()=>{
    sendCmdBtns();
  });  

  const userBuf = io.readTxtFile('users');
  const globBuf = io.readTxtFile('global');
  const cmdBuf = io.readTxtFile('commands');
  
  if(userBuf.length) users = JSON.parse(userBuf);
  if(globBuf.length) global = JSON.parse(globBuf);
  if(cmdBuf.length) cmdArr = JSON.parse(cmdBuf);
}

// On bot end
exports.end = () => {
  const userBuf = JSON.stringify(users);
  const globBuf = JSON.stringify(global);
  const cmdBuf = JSON.stringify(cmdArr);

  io.writeTxtFile('users', userBuf);
  io.writeTxtFile('global', globBuf);
  io.writeTxtFile('commands', cmdBuf);
}

exports.raidEvt= (usr) => {
  const usrIdx = checkUser(usr);
  const evt = users[usrIdx].events.raid;

  setTimeout(()=>{
    extra.play(evt);
  },3000);
}

// Process a bot command
exports.cmd = (msg, usr) => {
  const admin = (usr.username == this.channel);
  const usrIdx = checkUser(usr.username);
  const memer = (users[usrIdx].privlages.indexOf('memer') >= 0);
  const muted = (users[usrIdx].privlages.indexOf('muted') >= 0);
  const globalCmd = global.cmds.find(el => -1 < msg.split(' ').indexOf(el.name));
  let shortcut = false;
  let ret = false;

  if(!admin && (muted || global.nocmd)) return;

  if(users[usrIdx].shortcuts.length){
    shortcut = users[usrIdx].shortcuts.find(el => -1 < msg.split(' ').indexOf(el.name));
  }

  if(!shortcut && globalCmd && !msg.startsWith(cmdTrigger) && !users[usrIdx].mute){
    audio.play(globalCmd.file);
  }

  if(shortcut && !msg.startsWith(cmdTrigger) && !users[usrIdx].mute){
    const shortNum = ~~(Math.random()*shortcut.files.length);
    audio.play(shortcut.files[shortNum]);
  }

  if(!msg.startsWith(cmdTrigger)) return;

  // Remove whitespace from chat message
  const args = msg.slice(1).split(' ');
  const cmd = args.shift().toLowerCase().trim();

  switch(cmd){
    case '-':
      ret = removeShortcut(users[usrIdx].shortcuts, args);
      break;
    case '?':
      ret = checkShortcuts(users[usrIdx].shortcuts, args);
      break;
    case '!':
      if(users[usrIdx].lastCmd){
        if(args[0]){
          addShortcut(users[usrIdx].lastCmd, users[usrIdx], args[0])
        }else {
          audio.play(users[usrIdx].lastCmd);
        }
      }
      break;
    case '*':
      ret = `Set a command favorite with ${cmdTrigger}* command`;
      if(args[0] && io.check(args[0])) {
        users[usrIdx].favoriteCmd = args[0];
        ret = 'favorite set.';
      } else {
        if(users[usrIdx].favoriteCmd.length){
          const fav = users[usrIdx].favoriteCmd;
          if(io.check(fav)){
            audio.play(fav);
            ret = `Playing favorite: ${cmdTrigger}${fav}`;
          }else{
            users[usrIdx].favoriteCmd = '';
          }
        }
      }
      break;
    case 'mute':
      users[usrIdx].mute = !users[usrIdx].mute;
      ret = `${users[usrIdx].mute ? '' : 'un'}muted.`
      break;
  }

  if(ret){
    ret = `${usr.username} - ${ret}`;
  }

  switch(cmd){
    case 'a':
      ret = roll(usr.username);
      break;
    case 'c':
      ret = showCommands(args);
      break;
    case 'h':
      ret = showHelp();
      break;
    case 't':
      testVid();
      break;
    case 'barrelroll':
      barrelRoll();
      break;
    case 'tts':
      sendTTS(msg);
      break;
  }

  // Elevated commands
  if(admin || usr.mod || memer){

    if(admin){
      switch(cmd){
        case 'rem':
          ret = rem(msg, usr, 'audio')
          break;
        case 'priv':
          ret = setPrivlages(args);
          break;
        case 'silent':
          const silent = audio.setSilent();
          ret = 'Silence is ' + (silent ? 'on' : 'off');
          break;
      }

      // Check the global object
      if(!ret && global[cmd] !== undefined){
        global[cmd] = !global[cmd];
        ret = `${cmd}: ${global[cmd]}`;
      }
    }

    switch(cmd){
      case 'vol':
        ret = volume(cmd, usr)
        break;
      case 'rel':
        ret = relist(cmd, usr)
        break;
      case 'unl':
        ret = unlist(cmd, usr)
        break;
      case 'add':
        ret = add(cmd, usr)
        break;
      case 'mov':
        ret = mov(cmd, usr)
        break;
      case 's':
        audio.stop();
        break;
    }

    // Unlisted meme powers.
    if(io.secretList.indexOf(cmd) >= 0 && !ret){
      audio.play(cmd, true);
    }
  }

  if(!ret){
    // check if a command has a root and multiple other commands associated with it.
    const commandFilter = io.audList.filter(file => {
      const split = file.split(cmd);

      if(!split[0].length && split[1].match(/^\d+$/g)){
        return file;
      }

      return false;
    });

    // Play an audio command.
    if(io.audList.includes(cmd) || commandFilter.length){
      let audioCmd = cmd;
      
      if(commandFilter.length && !cmd.match(/\d+/g)){
        const cmdNum = ~~(Math.random()*commandFilter.length);
        audioCmd = commandFilter[cmdNum].split('.')[0];
      }
      
      if(admin && args[1] == 'global'){
        global.cmds.push({name: args[0], file: audioCmd});
        return;
      }
      
      play(audioCmd, usr.username, args[0])

    }
  }

  if(!global.verbose) ret = '';
  return ret;
}

/* -- Commands -- */
function sendTTS(){
  console.log('sending TTS');
}

function barrelRoll(){
  const obj = {
    type: 'msg',
    payload: 'barrelRoll'
  }

  socket.ws.send(JSON.stringify(obj));
}

function setPrivlages(args){
  let ret = false;
  let user = users.find(usr => {return usr.name == args[0]});
  let privList;
  const privlages = [
    'muted',
    'memer'
  ];

  if(user){
    privList = user.privlages;

    ret = `${privList.length ? privList.join(' | ') : 'no privlages.'}`;
  
    if(args.length == 3){
      const idx = privList.indexOf(args[2]);
      
      if(privlages.indexOf(args[2]) < 0) return 'unknown privalage.';

      switch(args[1]){
        case 'add':
          ret = 'already added.';
          if(0 > idx){
            privList.push(args[2]);
            ret = `adding ${args[2]}`;
          }
          break;
        case 'rem':
          ret = 'already removed.';
          if(-1 < idx){
            privList.splice(idx, 1);
            ret = `removing ${args[2]}`;
          }
          break;
        default:
          ret = 'unkown command';
          break;
      }
    } else if(args.length > 1){
      ret = `Use ${cmdTrigger}priv [user] [add/rem] [privlage]`;
    }
  }

  return ret;
}

function removeShortcut(shortcuts, args){
  let ret =  `Remove a shortcut command with '${cmdTrigger}- [shortcut] [commandIndex]', all shortcut commands with '${cmdTrigger}- [shortcut] all'. Check shortcuts with '${cmdTrigger}? [shortcut]'`;
  const shortcut = shortcuts.find(el => args[0] == el.name);
  
  if(shortcut){
    if(0 <= args[1] && args[1] <= shortcut.files.length-1){
      ret = `Removing ${shortcut.files[args[1]]}`;
      shortcut.files.splice(args[1], 1);

      if(!shortcut.files.length){
        const sIdx = shortcuts.findIndex((e) => {
          return e.name == shortcut.name;
        });
      
        shortcuts.splice(sIdx, 1);
      }

    } else if(args[1] == 'all'){
      const sIdx = shortcuts.findIndex((e) => {
        return e.name == shortcut.name;
      });
    
      shortcuts.splice(sIdx, 1);
      ret = `${args[0]} Removed.`;
    }
  } else if(args[0]) {
    ret = `${args[0]} shortcut not Found.`
  }

  return ret;
}

function testVid(){
  video.sendVid();
  // obs.playVid();
}

function checkShortcuts(shortcuts, args){
  let ret = false;
  const shortcut = shortcuts.find(el => args[0] == el.name);

  if(!args[0]){
    if(shortcuts.length){
      
      const shortIdx = shortcuts.map((e) => {
        return e.name;
      });

      ret = `${shortIdx.length} shortcuts - ${shortIdx.join(' | ')}`;
    } else {
      ret = `You have no shortcuts! Add one by using ${cmdTrigger}[command] [shortcut].`
    }
    return ret;
  }

  if(shortcut && shortcut.files.length){
    const shortIdx = shortcut.files.map((e, idx) => {
      return e = `(${idx}) ${e}`;
    });
    ret = `${shortcut.files.length} commands - ${shortIdx.join(' | ')}`
  } else {
    ret = `${args[0]} is not a shortcut.`
  }

  return ret;
}

exports.rollCmd = () => roll();
function roll(user = ''){
  const maxRand = 5;

  lastRolls.push(rand(io.audList.length-1))
  lastRolls = lastRolls.slice(maxRand * -1);

  const num = lastRolls[lastRolls.length - 1];
  const file = io.audList[num];

  play(file, user);

  return `You rolled a ${num} - ${cmdTrigger}${file}`;
}

function showHelp(){
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

function showCommands(args = []){
  let ret = false;

  /*
  if(args[0] == 'text'){
      ret = `${io.audList.length} commands - ${cmdTrigger}${io.audList.join(' ' + cmdTrigger)}`;
  }
  */

  ret = `${io.audList.length} commands - ${cmdTrigger}${io.audList.join(' ' + cmdTrigger)}`;

  /*
  const obj = {
      type: 'commands',
      list: list
  }
  ws.send(JSON.stringify(obj));
  */

  return ret;
}

function addShortcut(file, user, shortcut){
  const checkShortcut = user.shortcuts.find(el => {
    return el.name == shortcut;
  });

  if(checkShortcut){
    const checkFile = checkShortcut.files.find((e) => {
      return e === file;
    });

    if(!checkFile){
      checkShortcut.files.push(file);
    }
  } else {
    user.shortcuts.push({name: shortcut, files: [file]})
  }
}

function play(file, user, shortcut = ''){
    audio.play(file);

    if(user.length){
      let checkIdx = users.findIndex((e) => {
        return e.name.toLowerCase() == user.toLowerCase();
      });
  
      if(shortcut.length){
        addShortcut(file, users[checkIdx], shortcut)
      }
  
      users[checkIdx].lastCmd = file;
    }


    console.log(`* Playing Audio ${file} command`);
}

function checkUser(user){
  let checkIdx = users.findIndex((e) => {
    return e.name.toLowerCase() == user.toLowerCase();
  });

  if(checkIdx < 0){
    const userObj = {
      name: user,
      privlages: [],
      shortcuts: [],
      events: {},
      mute: false,
      lastCmd: '',
      favoriteCmd: ''
    }

    users.push(userObj);

    checkIdx = users.length - 1;
  }

  return checkIdx;
}

/* -- Utility functions -- */
function rand(n){
    let num = ~~(Math.random() * n);
    while (lastRolls.includes(num)) num = ~~(Math.random() * n);

    return num;
}

/* --------------- IO COMMANDS ---------------*/
function mov(msg, tags, type){
    const params = msg.split(' ');
    
      const oldN = params[1] || '';
      const newN = params[2] || '';
      let ret = false;
  
      if(params.length == 3 && oldN.length && newN.length){
        if(type == 'audio') ret = audio.rename(oldN, newN);
        // if('type' == 'video') video.rename(oldN, newN);
        dirty = true;
  
        if(ret){
          return `renaming ${oldN} to ${newN}.`;
        }
      }
  
      return `${tags.username} you can rename a ${type} command using '${cmdTrigger}mov${type.slice(0,1)} [old name] [new name]'`;
  }
  
  function relist(msg, tags, type){
    const params = msg.split(' '); 
    const name = params[1];
    let ret = false;
  
    if(type == 'audio') ret = audio.relist(name);
    dirty = true;
  
    if(ret){
      return 'relisting.';
    }
  
    return `${tags.username} you can unlist a ${type} command using '${cmdTrigger}unl${type.slice(0,1)} [command name]'`;
  }
  
  function unlist(msg, tags, type){
    const params = msg.split(' ');
    const name = params[1];
    let ret = false;
  
    if(type == 'audio') ret = audio.unlist(name);
    dirty = true;
  
    if(ret){
      return 'unlisting.';
    }
  
    return `${tags.username} you can unlist a ${type} command using '${cmdTrigger}unl${type.slice(0,1)} [command name]'`;
  }
  
  function rem(msg, tags, type){
    const params = msg.split(' ');
    const name = params[1];
    let ret = false;
  
    if(type == 'audio') ret = audio.rem(name);
    // if(type == 'video') ret = video.rem(name);
    dirty = true;
  
    if(ret){
      return 'removing.';
    }
  
    return `${tags.username} you can remove a ${type} command using '${cmdTrigger}rem${type.slice(0,1)} [command name]'`;
  }
  
  function volume(msg, tags){
    const params = msg.split(' ');
    if(params.length > 1){
  
      const name = params[1];
      const volumeNum = params[2];
      audio.volume(volumeNum, name);
      return 'volume being set.';
    }
  
    return `${tags.username} you can adjust volume on a command using '${cmdTrigger}vol [command name] [volume]'`;
  }
  
  function add(msg, tags){
    const params = msg.split(' ');
    
    const name = params[1];
    const ytLink = params[2];
    const start = params[3] || 0;
    const end = params[4] || 10;
    const instructions = params[5];

    let cmdObj = {
      name: name,
      dateAdded: new Date(),
      user: tags.username,
      reference: ytLink,
      video: false,
      startTime: start,
      length: end
    };

    cmds.push(cmdObj);
  
    if (params.length >= 5){
      const ytURL = audio.parseYTURL(ytLink);
  
      if(files.includes(name+'.mp3')){
        if(instructions == 'ow'){
          rem(msg, tags);
        }else{
          return `${name} already added.`;
        }
      }
  
      // audio.download(ytURL, name, [start, end]);
      
      dirty = true;
  
      return 'adding.';
    }
  
    return `${tags.username} you can add a command using '${cmdTrigger}add [command name] [youtube link] [start timestamp] [clip length]'`;
  }