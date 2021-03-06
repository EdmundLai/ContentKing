// code file used to populate the database with initial sample data

const sqlite3 = require("sqlite3").verbose();

const path = require("path");

const dbFileName = "content";

const pathName = path.join(__dirname, "/db/", dbFileName, ".db");

const { categories } = require("./reddit_categories");

// open database in memory
let db = initializeDbConnection();

async function initializeDb() {
  await initializeTables();

  await initializeDbWithSampleData();

  return db;
}

function closeDb(dbConn) {
  // close the database connection
  dbConn.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Close the database connection.");
  });
}

function initializeDbConnection() {
  let db = new sqlite3.Database(pathName, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log(`Connected to the SQlite database at ${pathName}.`);
  });

  db.exec("PRAGMA foreign_keys = ON;", function (error) {
    if (error) {
      console.error("Pragma statement didn't work.");
    } else {
      console.log("Foreign Key Enforcement is on.");
    }
  });

  return db;
}

async function insertSampleSubreddits() {
  // console.log("inside insertSampleSubreddits");

  Object.keys(categories).forEach((mainCategory) => {
    const mainCategoryObj = categories[mainCategory];

    Object.keys(mainCategoryObj).forEach((subCategory) => {
      const subCategoryObj = mainCategoryObj[subCategory];

      Object.keys(subCategoryObj).forEach(async (topicName) => {
        const subredditName = subCategoryObj[topicName];

        await insertSubreddit(
          topicName,
          mainCategory,
          subCategory,
          subredditName
        );
      });
    });
  });
}

async function initializeDbWithSampleData() {
  // we want to create users dynamically, not seed them

  // const usersEmpty = await checkIfTableIsEmpty("Users");

  const subredditsEmpty = await checkIfTableIsEmpty("Subreddits");
  if (subredditsEmpty) {
    await insertSampleSubreddits();
  }

  // user subreddits will be created as user adds them to the list
}

async function registerUser(username, password) {
  return new Promise((resolve, reject) => {
    var sql = "INSERT INTO Users (username, password) ";
    sql += "VALUES (? ,?) ";

    db.run(sql, [username, password], function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(`Last ID: ${this.lastID}, # of Row Changes: ${this.changes}`);
      }
    });
  });
}

async function getPasswordFromUsername(username) {
  return new Promise((resolve, reject) => {
    var sql = "SELECT password from USERS WHERE username = ?";

    db.get(sql, [username], (error, row) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        //console.log(username);
        //console.log(row);
        resolve(row);
      }
    });
  });
}

async function checkIfTableIsEmpty(tableName) {
  return new Promise((resolve, reject) => {
    var sql = `SELECT count(*) AS count from ${tableName}`;

    db.get(sql, (error, row) => {
      if (error) {
        reject(error);
      } else {
        resolve(row.count === 0);
      }
    });
  });
}

async function insertSubreddit(
  topicName,
  mainCategory,
  subCategory,
  subredditName
) {
  return new Promise((resolve, reject) => {
    var sql =
      "INSERT INTO Subreddits (topic_name, main_category, sub_category, subreddit_name) ";
    sql += "VALUES (?, ?, ?, ?) ";

    db.run(
      sql,
      [topicName, mainCategory, subCategory, subredditName],
      function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(`Last ID: ${this.lastID}, # of Row Changes: ${this.changes}`);
        }
      }
    );
  });
}

async function insertUserSubredditByLoginAndTopic(username, topic) {
  const userIdObj = await getUserIdByLogin(username);

  if (typeof userIdObj !== "undefined") {
    const subreddit_id = await getSubredditIdByTopic(topic);

    const user_id = userIdObj.user_id;

    await insertUserSubreddit(user_id, subreddit_id);
  }
}

async function deleteUserSubredditByLoginAndTopic(username, topic) {
  const userIdObj = await getUserIdByLogin(username);

  if (typeof userIdObj !== "undefined") {
    const subreddit_id = await getSubredditIdByTopic(topic);

    const user_id = userIdObj.user_id;

    await deleteUserSubreddit(user_id, subreddit_id);
  }
}

function getSubredditIdByTopic(subredditName) {
  return new Promise((resolve, reject) => {
    var sql = "SELECT subreddit_id ";
    sql += "FROM Subreddits ";
    sql += "WHERE topic_name = ? ";

    db.get(sql, subredditName, function (error, row) {
      if (error) {
        reject(error);
      }

      //console.error("Subreddit_id");
      //console.error(row.subreddit_id);

      resolve(row.subreddit_id);
    });
  });
}

// can be used to check if username exists in the database
async function getUserIdByLogin(username) {
  return new Promise((resolve, reject) => {
    var sql = "SELECT user_id ";
    sql += "FROM Users ";
    sql += "WHERE username = ? ";

    db.get(sql, username, function (error, row) {
      if (error) {
        reject(error);
      }
      // console.log(username);
      // console.error("User_id");
      // console.error(row.user_id);

      // returns undefined if username cannot be found

      resolve(row);
    });
  });
}

async function getSubredditNamesFromUserId(userId) {
  return new Promise((resolve, reject) => {
    var sql = "SELECT topic_name, subreddit_name, main_category, sub_category ";
    sql += "from Subreddits WHERE subreddit_id IN (SELECT subreddit_id ";
    sql += "FROM UserSubreddits ";
    sql += "WHERE user_id = ?) ";

    db.all(sql, userId, function (error, rows) {
      if (error) {
        reject(error);
      }
      // console.error("User_id");
      // console.error(row.user_id);

      resolve(rows);
    });
  });
}

async function getUserSubRedditsFromUsername(username) {
  const userIdObj = await getUserIdByLogin(username);

  // returns empty array if user cannot be found
  if (typeof userIdObj == "undefined") {
    return null;
  }

  const userId = userIdObj.user_id;

  const rows = await getSubredditNamesFromUserId(userId);

  //console.log(rows);

  return rows;
}

async function getAllSubreddits() {
  return new Promise((resolve, reject) => {
    var sql = "SELECT topic_name, subreddit_name, main_category, sub_category ";
    sql += "from Subreddits";

    db.all(sql, function (error, rows) {
      if (error) {
        reject(error);
      }
      // console.error("User_id");
      // console.error(row.user_id);

      //console.log(rows);

      resolve(rows);
    });
  });
}

function insertUserSubreddit(userId, subredditId) {
  return new Promise((resolve, reject) => {
    var sql = "INSERT INTO UserSubreddits (user_id, subreddit_id) ";
    sql += "VALUES (? ,?) ";

    db.run(sql, [userId, subredditId], function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(`Last ID: ${this.lastID}, # of Row Changes: ${this.changes}`);
      }
    });
  });
}

function deleteUserSubreddit(userId, subredditId) {
  return new Promise((resolve, reject) => {
    var sql =
      "DELETE FROM UserSubreddits WHERE user_id = ? AND subreddit_id = ?";

    db.run(sql, [userId, subredditId], function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(`Last ID: ${this.lastID}, # of Row Changes: ${this.changes}`);
      }
    });
  });
}

function initializeTables() {
  return new Promise((resolve, reject) => {
    const dbSchema = `CREATE TABLE IF NOT EXISTS Subreddits (
            subreddit_id integer NOT NULL PRIMARY KEY,
            topic_name text NOT NULL UNIQUE,
            main_category text NOT NULL,
            sub_category text NOT NULL,
            subreddit_name text NOT NULL UNIQUE
        );
        
        CREATE TABLE IF NOT EXISTS Users (
            user_id integer NOT NULL PRIMARY KEY,
            username text NOT NULL UNIQUE,
            password char(60) NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS UserSubreddits (
            id integer NOT NULL PRIMARY KEY,
            user_id integer NOT NULL,
            subreddit_id integer NOT NULL,
            FOREIGN KEY (user_id) REFERENCES Users(user_id),
            FOREIGN KEY (subreddit_id) REFERENCES Subreddits(subreddit_id)
        );`;

    db.exec(dbSchema, function (err) {
      if (err) {
        reject(err);
      }
    });

    resolve();
  });
}

module.exports.initializeDb = initializeDb;

module.exports.getUserIdByLogin = getUserIdByLogin;

module.exports.getUserSubRedditsFromUsername = getUserSubRedditsFromUsername;

module.exports.getPasswordFromUsername = getPasswordFromUsername;

module.exports.registerUser = registerUser;

module.exports.getAllSubreddits = getAllSubreddits;

module.exports.insertUserSubredditByLoginAndTopic = insertUserSubredditByLoginAndTopic;

module.exports.deleteUserSubredditByLoginAndTopic = deleteUserSubredditByLoginAndTopic;

module.exports.closeDb = closeDb;
