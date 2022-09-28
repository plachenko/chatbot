const crypto = require('crypto');
const fs = require('fs');

const {default: OBSWebSocket} = require('obs-websocket-js');
const obs = new OBSWebSocket();
obs.connect('ws://0.0.0.0:4445');

/* --- Api Instances --- */
const axios = require('axios');
const { getScreenSize } = require('robotjs');
const twitch_instance = axios.create({
    baseURL: 'https://api.twitch.tv/helix/',
    headers: {
        'Authorization': process.env.TWITCH_TOKEN,
        'Client-Id': process.env.TWITCH_CLIENT_ID
    }
});

exports.lastClipURL;

const date = new Date();
const dateStr = date.toISOString();

const lastDate = new Date();
lastDate.setDate(1);
lastDate.setMonth(date.getMonth()-2);
const lastDateStr = lastDate.toISOString();
/* --- */

exports.info = async (userName) => {
  const usrInfo = await getUserId(userName);
  const usrStreamData = await getStreamInfo(usrInfo?.id);

  console.log(usrStreamData, userName);

  return usrStreamData;
}

exports.getChatList = async () => {
  return axios.get('https://tmi.twitch.tv/group/user/plnrnd/chatters').then((e) => {
    return e.data.chatters.viewers;
  }).catch((err) => {
    console.log(err);
  });
}

async function getSList(){
  const itemList = await obs.call('GetSceneItemList', {
    sceneName: 'stableD',
  });
  
  /*
  const itemList = await obs.call('GetInputSettings', {
    inputName: 'Image 3',
  });
  */
  console.log(itemList.sceneItems[0].sceneItemTransform);
}

exports.sd = (args) => {
  getScreenSize();

  // console.log(args.split('--'));
  let tiled = false;

  const hash = crypto.randomBytes(20).toString('hex').slice(0, 10);
  axios.post(`http://${process.env.SDSERVER}:${process.env.SDPORT}/api/predict`,{
    "fn_index":11,
    "data":
      [
        args.join(' ') || 'test',
        "",
        "None",
        "None",
        20,
        "Euler a",
        false,
        tiled,
        1,
        1,
        7,
        -1,
        -1,
        0,
        0,
        0,
        false,
        512,
        512,
        false,
        false,
        0.7,
        "None",
        false,
        null,
        "",
        false,
        "Seed",
        "",
        "Steps",
        "" ,
        true,
        false,
        null,
        "",
        ""
      ],
      "session_hash": hash
    }
  ).then((e) => {
    const data = e.data.data[0][0].replace(/^data:image\/png;base64,/,"");
    fs.writeFile(`public/images/${hash}.png`, data, 'base64', (err)=>{
      if(err){
        console.log(err);
      }

      // getSList();
      
      obs.call('CreateInput', {
        sceneName: 'stableD', 
        inputName: hash,
        inputKind: 'image_source',
        inputSettings: {
          file: `C:/Users/denis/Documents/Repositories/com/github/plachenko/chatbot/public/images/${hash}.png`
        }
      }).then((e) => {
        obs.call('CreateSourceFilter', {
          sourceName: hash,
          filterName: 'Chroma Key',
          filterKind: 'chroma_key_filter_v2'
        });
        obs.call('SetSceneItemTransform', {
          sceneName: 'stableD',
          sceneItemId: e.sceneItemId,
          sceneItemTransform: {
            alignment: 5,
            boundsAlignment: 0,
            boundsHeight: 1200,
            boundsType: 'OBS_BOUNDS_SCALE_INNER',
            boundsWidth: 1920,
            height: 512,
            width: 512,
            sourceHeight: 512,
            sourceWidth: 512
          }
        })
      });    
    });
  }).catch((err) => {
    console.log(err);
  })
}

exports.shoutout = async (userName) => {
  const usrInfo = await getUserId(userName);
  const usrChannelData = await getUsrInfo(usrInfo?.id);
  const {game_name, title, game_id} = usrChannelData;

  const clipURL = await getStreamClip(usrInfo?.id, game_id);

  this.lastClipURL = clipURL.embed;

  if(!usrInfo || !usrChannelData) return `No stream found.`;

  return `${userName} (https://www.twitch.tv/${userName}) was last streaming ${game_name} - "${title}" ${clipURL.url || ''}`
}

async function getUserId(user){
  const endPoint = `/users?login=${user}`;
  return await twitch_instance.get(endPoint).then(d => {
    const data = d.data.data[0];

    return data;
  }).catch(err => {
    return false;
  });
}

async function getStreamClip(usrId, gameId = null){
  const endPoint = `/clips?broadcaster_id=${usrId}&started_at=${lastDateStr}&ended_at=${dateStr}`
  return await twitch_instance.get(endPoint).then(d => {
    const data = d.data.data;
    let lastGameArr = data.filter(e => e.game_id == gameId);
    let clip;

    
    if(lastGameArr.length){
      clip = lastGameArr.sort((a, b) =>  b.view_count - a.view_count);
    } else {
      clip = d.data.data.sort((a, b) =>  b.view_count - a.view_count);
    }

    // THANK YOU 4aiman!! (https://twitch.tv/4aiman)
    let turl = clip[0].thumbnail_url;
    turl = turl.slice(0, turl.length-20)+'.mp4';

    return {url: clip[0].url, embed: turl};
  }).catch(err => {
    return false;
  });
}

async function getStreamInfo(usrId){
  const endPoint = `/streams?user_id=${usrId}`;
  return await twitch_instance.get(endPoint).then(d => {
    const data = d.data.data[0];

    return data;
  }).catch(err => {
    return false;
  });
}

async function getUsrInfo(usrId){
  const endPoint = `/channels?broadcaster_id=${usrId}`;
  return await twitch_instance.get(endPoint).then(d => {
    const data = d.data.data[0];

    return data;
  }).catch(err => {
    return false;
  });
}

async function getLastFollow(usrId){
  const endPoint = `users/follows?first=1&to_id=${usrId}`;
  return await twitch_instance.get(endPoint).then(d => {
    const data = d.data.data[0];

    return data;
  }).catch(err => {
    return false;
  });
}
