const user = require('./user');

const admin = require('./commands/admin_cmds');
const api = require('./commands/api_cmds');
const gen = require('./commands/gen_cmds');
const io = require('./commands/io_cmds');
const usr = require('./commands/usr_cmds');
const game = require('./commands/game_cmds');

const aud = require('./commands/audio_cmds');

const cmdArr = [];
const reserved = [];
const gameCmds = ['!honk', '!bang'];
const commands = {};

const ws = require('./websocket');
const { client } = require('tmi.js');
ws.connectWS();

// General chat commands
commands['chatCmds'] = {
  'lurk': gen.lurk,
  'so': api.shoutout,
  'c': gen.showCommands,
  'h': gen.showHelp,
  'discord': gen.showDiscord,
  'addcmd': gen.addCmd,
  'tts': gen.sendTTS,
  'barrelRoll': gen.barrelRoll,
  'join': gen.join
}

commands['unreal'] = {
  'throw': gen.throw,
  'shotgun': gen.shotgun
}

commands['audioCmds'] = {
  'aud': aud.sendAudioChan
}

/* TODO: Split these commands out-- these should be set to 'global aliases' */
commands['gameCmds'] = {
  'radio': game.changeRadio,
  'jack': game.jack,
  'murk': game.murk,
  'work': game.work,
  'crouch': game.crouch,
  'switch': game.switch,
  'move': game.move,
  'yes': game.yes,
  'no': game.no
}

// Personalized user commands
commands['usrCmds'] = {
  '-': usr.remove,
  '?': usr.check,
  '!': usr.last,
  '*': usr.favorite,
  'mute': usr.toggleMute
}

// Admin specific commands
commands['adminCmds'] = {
  'priv': admin.setPrivlages,
  'silent': admin.setSilent,
  'audStart': aud.startPulse,
  'audStop': aud.stopPulse,
}

// I/O Commands to add, remove, edit or (un)list
commands['ioCmds'] = {
  'add': io.addCmd,
  'rem': io.removeCmd,
  'edit': io.editCmd,
  'list': io.toggleListed,
  'show': gen.showClip
}

// Create a reserved commmand array
for(c in commands){
  for(i in commands[c]){
    reserved.push(i);
  }
}

// Create a game commmand array (FOR GTA GAMES)
for(c in commands['gameCmds']){
  gameCmds.push('!'+c);
}

exports.start = () => {
  // user.getUsers();
}

exports.end = () => {
  // user.setUsers();
}

exports.raidEvt = async (usr) => {
  // const evt = users[usrIdx].events.raid;
  return await api.shoutout(usr);
}

exports.hostEvt = async (usr) => {
  return `${usr} is now hosting! Thank you!`;
}

exports.cmd = async (msg, usr, cmd, args, chan, bot) => {
  // user.check(usr.username);

  if(!admin && admin.silence) return;
  if(!msg.startsWith(gen.commandTrigger)) return;

  // const usrIdx = checkUser(usr.username);
  const privUsr = (usr.admin || usr.mod || usr.badges?.vip == '1');

  if(cmd == 'gtacmds'){
    return `GTA commands: ${gameCmds.join(' ')}`;
  }

  // honk.
  if((/(h[o]{1,}nk)/g).test(cmd)){
    let honks = cmd.match(/([o]{1,})/g);
    return await game.sendHonk(honks);
  }

  // bang!
  if((/(b[a]{1,}ng)/g).test(cmd)){
    let bangs = cmd.match(/([a]{1,})/g);
    return await game.banging(bangs);
  }

  if(cmd == 'throw' && (usr.mod || usr.admin) && args[0] == 'chat'){
    setTimeout(() => {
      bot.clear(chan)
    }, 2000);
  }

  // Check the reserved commands.
  for(c in commands){
    if(commands[c][cmd]){

      if(c == 'adminCmds' && !usr.admin) return;

      if(c == 'ioCmds') {
        // Check user privlage
        if(!privUsr) return;

        const validCmd = !(reserved.indexOf(args[0]) > -1) && (/^\w+$/).test(args[0]);
        if(!validCmd) return 'invalid or reserved command name.';
      }

      // If shoutout without argument, shout yourself out.
      if((cmd == 'so') && !args.length){
        args = usr['display-name'];
      }

      return await commands[c][cmd](args);
    }
  }

  // Otherwise play meme commands
}
