let lastRolls = [];

const cmdTrigger = "!";
exports.commandTrigger = cmdTrigger;

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
