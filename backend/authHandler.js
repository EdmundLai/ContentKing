const bcrypt = require("bcryptjs");

const saltRounds = 10;

const dbManager = require("./dbManager");

async function insertUserCredentials(username, password) {
  return new Promise(async (resolve, reject) => {
    const row = await dbManager.getUserIdByLogin(username);
    //console.log(row);
    if (typeof row !== "undefined" && row.hasOwnProperty("user_id")) {
      reject("User already exists");
      return;
    }

    // if user doesn't already exist, hash password and insert hashed pass
    // and username into the db

    bcrypt.hash(password, saltRounds, (err, hash) => {
      dbManager.registerUser(username, hash);
    });

    resolve();
  });
}

module.exports.insertUserCredentials = insertUserCredentials;
