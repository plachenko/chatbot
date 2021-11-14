
const audio = require('./audio');

/*
let greetings = ['hi', 'hello', 'hey', 'yo', 'greetings'];
let greets = ['hidenny', 'whatup', 'openup', 'alert', 'coming', 'wazzup'];
let lastGreet = [];
let parts = ['bye', 'goodbye', 'farewell', 'seeya', 'adios'];
let byes = ['doodoo', 'haircut', 'byefelicia', 'seinfeld', 'later', 'merychristmas', 'shootingstar', 'lesson', 'done', 'coffin'];
*/

exports.play = (label) => {
  switch(label){
    case 'fbi':
      fbi();
      break;
  }
}

function grunty(){
  audio.play('signskit1', true);
  setTimeout(()=>{
    audio.play('grunt');
  }, 1000);
}

function fbi(){
  // client.say(chanTarget, '(fbi open up)');
  let time = ~~(Math.random() * 3) + 2;
  let sounds = ['openup', 'openup2', 'ak', 'explode'];
  // let sounds = ['pba1', 'pba2', 'ak', 'explode'];
  let lastpba = 0;
  silence = true;
  
  audio.play('pba');

  let offset = 4 * 1000;
  
  setTimeout(()=> {
    audio.play('openup_skit', true);
  }, offset);

  setTimeout(() => {
    audio.play('pba1');
    setTimeout(() => {
      audio.play('pba2');
    }, 2000);
  }, 12000 + offset);

  setTimeout(() => {
    silence = false;
  }, 27000 + offset);

  for(let i = 0; i < time; i++){
    setTimeout(()=>{
      // const sound = sounds[~~(Math.random()*sounds.length-1)];
      const sound = sounds[0];

      audio.play(sound);

    }, (6000 * i) + (~~(Math.random() * 7) + 2) * 1000 + offset);
  }
}

/*
  function resetStreak(){
    clearInterval(streak.interval);
    streak.interval = null;
    
    audio.stop();
    streak.string = '';
  
    if(streak.lastUser){
      output = `${streak.lastUser} killed the streak`;
    } else {
      output = 'Streak has timed out.';
    }
  
    client.say(chanTarget, `${output} (${streak.count})`);
  
    streak.count = 0;
  
    audio.play('america');
    audio.play('panic', false, 3);
  }
  
function streakTimer(){
    streak.int = streak.max;
    streak.interval = setInterval(()=>{
      streak.int --;
      if(streak.int < 0){
        audio.stop();
        resetStreak();
      }
    }, streak.delay);
  }

  function checkStreakEmote(msg, tags){
    if(streak.string.length > 0){
      if(!msg.includes(streak.string)){
        streak.lastUser = tags.username;
        resetStreak();
        return;
      }else {
        streak.int = streak.max;
        streak.count++;
        streak.lastUser = tags.username;
        if(msg.includes(streak.start)) return;
        return;
      }
    }
  
    if(msg.includes('bewmCat1')){
      let aud = ['lon', 'sholong'];
      let song = aud[~~(Math.random() * aud.length)];
  
      streakTimer();
      
      audio.play(song, true);
  
      streak.start = 'bewmCat1';
      streak.string = 'bewmCat2';
    }
  }

  if(greetings.includes(command)){
    let greetNum = ~~(Math.random() * greets.length);
    while (greetNum === lastGreet) greetNum = ~~(Math.random() * greets.length-1);

    if(args.length >= 1){
      user = `${args[0]}`;
    }
    
    if(lastGreet !== greetNum){
      audio.play(greets[greetNum]);
      lastGreet = greetNum;
    }
    output = `HeyGuys Hello world ${user}, thank you for asking.`;
  }

  if(parts.includes(command)){
    let byeNum = ~~(Math.random() * byes.length);
    while (byeNum === lastPart) byeNum = ~~(Math.random() * byes.length);

    let user = tags.username;
    if(args.length >= 1){
      user = `${args[0]}`;
    }

    audio.play(byes[byeNum]);
    lastPart = byeNum;

    output = `peepoLeave Have a good one ${user}, thank you for asking.`;
  }

  
  if(command == 'store'){
    if(args[0] !== undefined){
      audio.play('sign', true);
      setTimeout(()=>{
        audio.play(args[0])
        setTimeout(()=>{
          audio.play('sign1', true)
          setTimeout(()=>{
            audio.play(args[0])
            setTimeout(()=>{
              audio.play('sign2', true)
              setTimeout(()=>{
                audio.play(args[0])
                setTimeout(()=>{
                  audio.play('sign3', true)
                  setTimeout(()=>{
                    audio.play(args[0])
                    setTimeout(()=>{
                      audio.play('sign4', true)
                    }, 1000);
                  }, 4000);
                }, 3000);
              }, 4000);
            }, 2000);
          }, 7000);
        }, 2000);
      }, 3000);
    }
  }
*/