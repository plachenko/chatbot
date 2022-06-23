const OSC = require('node-osc');
const Client = OSC.Client;
const Bundle = OSC.Bundle;
const client = new Client('0.0.0.0', 7001);

const api = require('./api_cmds');

let pulseInt = null;
let playing = false;

const octaves = [
  0,
  .167,
  .333,
  .417,
  .583,
  .750,
  .917,
  1
];

//-- Pulse Commands
exports.startPulse = () => {
  let maxPulse = 0;
  let tickInt = 1000;

  // unmute audio
  this.sendAudioChan(8, 1);

  pulseInt = setInterval(() => {
    if(maxPulse <= 0) {
      maxPulse = Math.round((Math.random() * 600)) + 60;
      tickInt = ((Math.random() * 5) * 1000) + 500;
    }


    let octaveVal = octaves[Math.floor(Math.random()*octaves.length)];

    // console.log(octaveVal)

    this.sendAudioChan(1, octaveVal);
    maxPulse--;
  }, tickInt);
}

exports.stopPulse = () => {
  clearInterval(pulseInt);
  pulseInt = null;
  playing = false;

  //send Signal to mute audio.
  this.sendAudioChan(8, 0);
}
//--

exports.test = () => {
  console.log('testing.');
  let sendChan = '/ch/4';
  let sendVal = Math.random() * 10;

  const bundle = new Bundle([sendChan, sendVal]);
  OSCsend(bundle);
}

exports.sendMsg = (param) => {
  let sendChan = '/ch/4';
  let sendVal = param.split(' ').length || Math.random() * 10;
  // console.log(sendVal);

  const bundle = new Bundle([sendChan, sendVal]);


  OSCsend(bundle);

  return;
}

exports.sendAudioChan = (_sendChan = 1, _sendVal = 0) => {
  let sendChan = `/ch/${parseInt(_sendChan)}`;
  let sendVal = _sendVal || Math.round(Math.random() * 10);
  const bundle = new Bundle([sendChan, sendVal]);

  // console.log(bundle.elements[0].args)
  OSCsend(bundle);

  return;
}


function OSCsend(_bundle){
  client.send(_bundle, () => {
    // client.close();
  });
}

this.startPulse();
