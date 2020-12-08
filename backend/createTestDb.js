// file for testing how to use the sqlite3 npm package

const sqlite3 = require("sqlite3").verbose();

const DB_PATH = "./db/test.db";

// open database in memory
let db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Connected to the SQlite database at ${DB_PATH}.`);
});

dbSchema = `CREATE TABLE IF NOT EXISTS Users (
    id integer NOT NULL PRIMARY KEY,
    login text NOT NULL UNIQUE,
    password text NOT NULL,
    email text NOT NULL UNIQUE,
    first_name text,
    last_name text
);

CREATE TABLE IF NOT EXISTS Blogs (
    id integer NOT NULL PRIMARY KEY,
    user_id integer NOT NULL UNIQUE,
    blog text NOT NULL,
    title text NOT NULL,
    publish_date date,
        FOREIGN KEY (user_id) REFERENCES Users(id)
);`;

db.exec(dbSchema, function (err) {
  if (err) {
    console.log(err);
  }
});

// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Close the database connection.");
});
