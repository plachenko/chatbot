/* --- Api Instances --- */
const axios = require('axios');
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

  return usrStreamData;
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
