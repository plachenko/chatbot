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

exports.shoutout = async (userName) => {
   const usrInfo = await getUserId(userName);
   const usrChannelData = await getUsrInfo(usrInfo.id);
   const {game_name, title} = usrChannelData;

   return`${userName} (https://www.twitch.tv/${userName}) was last seen under ${game_name} - "${title}"`
}

async function getUserId(user){
  const endPoint = `/users?login=${user}`;
  return await twitch_instance.get(endPoint).then(d => {
    const data = d.data.data[0];

    return data;
  })
}

async function getUsrInfo(usrId){
  const endPoint = `/channels?broadcaster_id=${usrId}`;
  return await twitch_instance.get(endPoint).then(d => {
    const data = d.data.data[0];

    return data;
  });
}
