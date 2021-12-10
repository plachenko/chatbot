let silent = false;

exports.silence = silent;

exports.setPrivlages = () => {
  /*
  let ret = false;
  let user = users.find(usr => {return usr.name == args[0]});
  let privList;
  const privlages = [
    'muted',
    'memer'
  ];

  if(user){
    privList = user.privlages;

    ret = `${privList.length ? privList.join(' | ') : 'no privlages.'}`;

    if(args.length == 3){
      const idx = privList.indexOf(args[2]);

      if(privlages.indexOf(args[2]) < 0) return 'unknown privalage.';

      switch(args[1]){
        case 'add':
          ret = 'already added.';
          if(0 > idx){
            privList.push(args[2]);
            ret = `adding ${args[2]}`;
          }
          break;
        case 'rem':
          ret = 'already removed.';
          if(-1 < idx){
            privList.splice(idx, 1);
            ret = `removing ${args[2]}`;
          }
          break;
        default:
          ret = 'unkown command';
          break;
      }
    } else if(args.length > 1){
      ret = `Use ${cmdTrigger}priv [user] [add/rem] [privlage]`;
    }
  }

  return ret;
  */
}

exports.setSilent = () => {
  silent = !silent;
  this.silence = silent;

  return `silence is ${silent ? 'on' : 'off'}`;
}

