const robo = require('robotjs');
const ws = require('../websocket');
// ws.connectWS();

let murking = false;
let guessNum = ~~(Math.random()*7);
let guessTry = 0;

robo.setKeyboardDelay(1);

exports.murk = () => {
  if(murking) return;

  robo.keyToggle('delete', 'down');
  robo.keyToggle('numpad_0', 'down');

  setTimeout(()=> {
    robo.keyToggle('delete', 'up');
    robo.keyToggle('numpad_0', 'up');
    murking = false;
  }, 1000);
  return `caught a body!`;
}

exports.switch = (itr) => {
  if(itr >= 16) itr = 16;
  switchWeaps(itr[0] || ~~(Math.random()*4));
}

exports.changeRadio = (itr) => {
  if(itr >= 16) itr = 16;
  changeR(itr[0] || ~~(Math.random()*12));
  return `changed radio`;
}

exports.break = (num) => {
  console.log('breaking...', num);
}

exports.accelerate = (num) => {
  console.log('accelerating', num);
}

exports.jack = (guess) => {
  /*
  robo.keyToggle('F', 'down');
  setTimeout(()=> {
    robo.keyToggle('F', 'up');
  }, 1000);
  */
  if(!guess[0]) guess[0] = ~~(Math.random()*7);

  if(Number(guess[0]) == guessNum){
    robo.keyTap('f');
    guessNum = ~~(Math.random()*7);
    guessTry = 0;

    return `jackpot!`;
  }else{
    guessTry++;

    if(guessTry <= 2){
      return `${3 - guessTry} tries left!`;
    } else {
      guessNum = ~~(Math.random()*7);
      guessTry = 0;

      return `Jacking failed. Number was ${guessNum} Resetting guesses.`;
    }
  }
}

let working = false;
exports.work = () => {
  robo.keyTap('2');
  working = !working;
  if(working) return `clocking in!`;
  return `clocking out!`;
}

exports.sendfbi = () => {
  console.log('sending.');
  robo.typeString('BRINGITON');
}

exports.sendBoom = () => {
  const max = 30;
  const limit = 10;
  const ranNum = Math.floor(Math.random()*max);

  if(ranNum < limit){
    robo.typeString('allcarsgoboom');
    return 'boop.'
  }
}

exports.sendHonk = (honks) => {
  const obj = {
    type: 'honks',
    payload: {
      honks: honks
    }
  };

  ws.send(JSON.stringify(obj));

  // honk(honks, itr);
  return `honk.`;
}

exports.yes = (bangs) => {
  bang(bangs);
  return `bang!`;
}

exports.no = (bangs) => {
  bang(bangs);
  return `bang!`;
}

exports.banging = (bangs) => {
  bang(bangs);
  return `bang!`;
}

exports.crouch = () => {
  robo.keyTap('c');
}

function switchWeaps(itr){
  for(let i = 0; i<=itr-1; ++i){
    robo.keyTap('Q');
  }
}

function changeR(itr){
  if (itr <= 0) return;
  console.log(itr);

  robo.keyTap('insert');
  setTimeout(()=>{
    changeR(--itr);
  }, 50);
}

function bang(bangs){

  if(bangs.length <= 0) return;

  robo.keyToggle('=', 'down');
  robo.keyToggle('numpad_0', 'down');
  setTimeout(() => {
    robo.keyToggle('numpad_0', 'up');
    robo.keyToggle('=', 'up');
    bang(bangs.slice(1));
  }, 200 * bangs[0].length);
}

exports.starthonk = () => {
  // if(honks.length <= 0) return;

  robo.keyToggle('f7', 'down');
  /*
  setTimeout(() => {
    honk(honks.slice(1));
  }, 100 * honks[0].length);
  */
}

exports.endHonk = () => {
  robo.keyToggle('f7', 'up');
}
