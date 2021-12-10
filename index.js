require('dotenv').config();

const process = require('process');
const tmi = require('tmi.js');
const bot = require('./src/bot');

const opts = {
    identity: {
        username: process.env.BOT_USERNAME,
        password: process.env.OAUTH_TOKEN
    },
    channels: [
        process.env.CHANNEL_NAME
    ]
};

// const channel = opts.channels[0];

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('connected', onConnectedHandler);
client.on('message', onMessageHandler);
client.on('raided', onRaidHandler);

// Connect to Twitch:
client.connect();

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
    bot.start();
}

// Called every time a message comes in
async function onMessageHandler (channel, user, msg, self) {
  if(msg.length == 1 || self) return;

  user.admin = (user.username == opts.channels[0].slice(1));

  // Remove whitespace from chat message
  const args = msg.slice(1).split(' ');
  const cmd = args.shift().toLowerCase().trim();

  const output = await bot.cmd(msg, user, cmd, args);

  if(output){
    client.say(channel, output);
  }
}

// Called every time a raid comes in
async function onRaidHandler(chan, user, viewers){
  const output = await bot.raidEvt(user);

  if(output){
    client.say(channel, output);
  }
}

/*-- Catch the exit event --*/
process.stdin.resume();

function exitHandler(options, exitCode) {
    /*
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    */
    if (options.exit){
        bot.end();
        process.exit();
    }
}

process.on('uncaughtException', (err)=>{
  console.log(err);
});

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
/* -- */
