const user = require('./user');

const admin = require('./commands/admin_cmds');
const api = require('./commands/api_cmds');
const gen = require('./commands/gen_cmds');
const io = require('./commands/io_cmds');
const usr = require('./commands/usr_cmds');
const game = require('./commands/game_cmds');

const cmdArr = [];
const reserved = [];
const commands = {};

const ws = require('./websocket');
ws.connectWS();

// General chat commands
commands['chatCmds'] = {
  'so': api.shoutout,
  'a': gen.roll,
  'c': gen.showCommands,
  'h': gen.showHelp,
  'discord': gen.showDiscord,
  'addcmd': gen.addCmd,
  'tts': gen.sendTTS,
  'barrelRoll': gen.barrelRoll,
  'broke': gen.showBroke
};

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
};

// Admin specific commands
commands['adminCmds'] = {
  'priv': admin.setPrivlages,
  'silent': admin.setSilent
};

// I/O Commands to add, remove, edit or (un)list
commands['ioCmds'] = {
  'add': io.addCmd,
  'rem': io.removeCmd,
  'edit': io.editCmd,
  'list': io.toggleListed
};

// Create a reserved commmand array
for(c in commands){
  for(i in commands[c]){
    reserved.push(i);
  }
}

exports.start = () => {
  user.getUsers();
}

exports.end = () => {
  user.setUsers();
}

exports.raidEvt = async (usr) => {
  // const evt = users[usrIdx].events.raid;
  return await api.shoutout(usr.username);
}

exports.cmd = async (msg, usr, cmd, args) => {
  user.check(usr.username);

  if(!admin && admin.silence) return;
  if(!msg.startsWith(gen.commandTrigger)) return;

  // const usrIdx = checkUser(usr.username);
  const privUsr = (usr.admin || usr.mod);

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

      return await commands[c][cmd](args);
    }
  }

  // Otherwise play meme commands
}
