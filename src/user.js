const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('./db/chatbot.sqlite');
const db = new sqlite3.Database('chatbotDB.sqlite');
const users = [];
const usrObj = {
  id: 0,
  name: null,
  privlages: [],
  commands: {
    shortcuts: [],
    lastCmd: null,
    favoriteCmd: null
  },
  events: {
    raid: null,
    join: null,
    part: null
  }
}

exports.list = users;

// Set sql props
const usrProps = [];
for(prop in usrObj){
  usrProps.push(prop);
}
const placeholders = usrProps.map(el => '?').join(', ');

exports.check = (user) => {
  let checkIdx = users.findIndex((e) => {
    return e.name.toLowerCase() == user.toLowerCase();
  });

  if(checkIdx <= 0){
    usrObj.id = users.length + 1;
    usrObj.name = user;
    users.push(usrObj);

    checkIdx = usrObj.id;
  }

  return checkIdx;
}

exports.getUsers = () => {
  console.log('reading from database');
  // console.log(users);

  /*
  db.each('SELECT * FROM users', (e) => {
    console.log(e);
  });
  */
}

const objs = [];

for(let i = 0; i < 4; ++i){
  const obj = {
    name: 'test'+i,
    it: i
  }
  objs.push(obj);
}
// db.run("CREATE TABLE lorem (info TEXT, other TEXT)");

exports.setUsers = () => {
  console.log('writing to database');

  let stmt =  db.prepare("INSERT INTO lorem VALUES (?, ?)");
  objs.forEach(el => {

    let vals = []
    for(p in el){
      vals.push(el[p]);
    }
    console.log(vals)
    stmt.run(vals);
  });


  /*
  const sql = `INSERT INTO users VALUES (${placeholders})`;
  // console.log(sql);

  let stmt = db.prepare(sql);
  users.forEach(user => {
    let vals = [];
    for(prop in user){
      let insert = user[prop];
      if(typeof user[prop] == 'object'){
        insert = JSON.stringify(user[prop]);
      }
      vals.push(insert);
    }
    stmt.run(vals)
  });
  stmt.finalize();
  */
}

exports.getUserInfo = () => {

}
