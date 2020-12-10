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

async function compareUserCredentials(username, password) {
  return new Promise(async (resolve, reject) => {
    try {
      const row = await dbManager.getPasswordFromUsername(username);
      if (typeof row == "undefined") {
        resolve({
          valid: false,
          showUser: true,
          errorMessage: "User provided invalid credentials",
        });
      } else {
        const hashedPass = row.password;
        const correctPass = await bcrypt.compare(password, hashedPass);
        if (correctPass) {
          resolve({ valid: true });
        } else {
          resolve({
            valid: false,
            showUser: true,
            errorMessage: "User provided invalid credentials",
          });
        }
      }
    } catch (error) {
      resolve({
        valid: false,
        showUser: false,
        errorMessage: error,
      });
    }
  });
}

module.exports.insertUserCredentials = insertUserCredentials;

module.exports.compareUserCredentials = compareUserCredentials;
