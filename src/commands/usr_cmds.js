exports.remove = (shortcuts, args) => {
  /*
  let ret =  `Remove a shortcut command with '${cmdTrigger}- [shortcut] [commandIndex]', all shortcut commands with '${cmdTrigger}- [shortcut] all'. Check shortcuts with '${cmdTrigger}? [shortcut]'`;
  const shortcut = shortcuts.find(el => args[0] == el.name);

  if(shortcut){
    if(0 <= args[1] && args[1] <= shortcut.files.length-1){
      ret = `Removing ${shortcut.files[args[1]]}`;
      shortcut.files.splice(args[1], 1);

      if(!shortcut.files.length){
        const sIdx = shortcuts.findIndex((e) => {
          return e.name == shortcut.name;
        });

        shortcuts.splice(sIdx, 1);
      }

    } else if(args[1] == 'all'){
      const sIdx = shortcuts.findIndex((e) => {
        return e.name == shortcut.name;
      });

      shortcuts.splice(sIdx, 1);
      ret = `${args[0]} Removed.`;
    }
  } else if(args[0]) {
    ret = `${args[0]} shortcut not Found.`
  }

  return ret;
  */
}

exports.check = (shortcuts, args) => {
  /*
  let ret = false;
  const shortcut = shortcuts.find(el => args[0] == el.name);

  if(!args[0]){
    if(shortcuts.length){

      const shortIdx = shortcuts.map((e) => {
        return e.name;
      });

      ret = `${shortIdx.length} shortcuts - ${shortIdx.join(' | ')}`;
    } else {
      ret = `You have no shortcuts! Add one by using ${cmdTrigger}[command] [shortcut].`
    }
    return ret;
  }

  if(shortcut && shortcut.files.length){
    const shortIdx = shortcut.files.map((e, idx) => {
      return e = `(${idx}) ${e}`;
    });
    ret = `${shortcut.files.length} commands - ${shortIdx.join(' | ')}`
  } else {
    ret = `${args[0]} is not a shortcut.`
  }

  return ret;
  */
}

exports.last = () => {
  /*
  if(users[usrIdx].lastCmd){
    if(args[0]){
      addShortcut(users[usrIdx].lastCmd, users[usrIdx], args[0])
    }else {
      audio.play(users[usrIdx].lastCmd);
    }
  }
  */
}

exports.favorite = () => {
  /*
  ret = `Set a command favorite with ${cmdTrigger}* command`;
  if(args[0] && io.check(args[0])) {
    users[usrIdx].favoriteCmd = args[0];
    ret = 'favorite set.';
  } else {
    if(users[usrIdx].favoriteCmd.length){
      const fav = users[usrIdx].favoriteCmd;
      if(io.check(fav)){
        audio.play(fav);
        ret = `Playing favorite: ${cmdTrigger}${fav}`;
      }else{
        users[usrIdx].favoriteCmd = '';
      }
    }
  }
  */
}

exports.toggleMute = () => {
  /*
  users[usrIdx].mute = !users[usrIdx].mute;
  ret = `${users[usrIdx].mute ? '' : 'un'}muted.`
  return ret;
  */
}
