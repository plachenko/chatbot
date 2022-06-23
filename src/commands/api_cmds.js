/* --- Api Instances --- */
const axios = require('axios');
const twitch_instance = axios.create({
    baseURL: 'https://api.twitch.tv/helix/',
    headers: {
        'Authorization': process.env.TWITCH_TOKEN,
        'Client-Id': process.env.TWITCH_CLIENT_ID
    }
});
/* --- */

exports.info = async (userName) => {
  const usrInfo = await getUserId(userName);
  const usrStreamData = await getStreamInfo(usrInfo?.id);


  return usrStreamData;
}

exports.shoutout = async (userName) => {
  const usrInfo = await getUserId(userName);
  const usrChannelData = await getUsrInfo(usrInfo?.id);
  const {game_name, title} = usrChannelData;

  if(!usrInfo || !usrChannelData) return `No stream found.`;

  return `${userName} (https://www.twitch.tv/${userName}) was last streaming ${game_name} - "${title}"`
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

async function getStreamInfo(usrId){
  const endPoint = `/streams?user_id=${usrId}`;
  console.log(endPoint);
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
