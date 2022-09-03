const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('chatbot.sqlite');

exports.projectTitle = "it";

exports.getProject = (cb) => {
    // Get the last project that was added to the DB and return it

    db.get("SELECT title FROM projects ORDER BY id DESC LIMIT 1", (err, row) => {
        cb(row);
        this.projectTitle = row;
    });
}

exports.addProject = (projectName) => {
    const date = new Date();
    let stmt =  db.prepare("INSERT INTO projects VALUES (NULL, ?, ?)");

    stmt.run(date, projectName);
}