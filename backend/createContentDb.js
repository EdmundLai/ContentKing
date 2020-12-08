// code file used to populate the database with initial sample data

const sqlite3 = require("sqlite3").verbose();

const DB_PATH = "./db/content.db";

const { categories } = require("./reddit_categories");
const { userData } = require("./user_prefs");

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
  let db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log(`Connected to the SQlite database at ${DB_PATH}.`);
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

async function insertSampleUsers() {
  await registerUser("Egg", "Kappa123");
  await registerUser("Bacon", "AYAYA123");
}

async function insertSampleSubreddits() {
  // await insertSubreddit("Javascript", "programming", "languages", "javascript");
  // await insertSubreddit("Genshin Impact", "gaming", "games", "Genshin_Impact");
  // await insertSubreddit(
  //   "Counterstrike: Global Offensive",
  //   "gaming",
  //   "games",
  //   "GlobalOffensive"
  // );

  // console.log("inside insertSampleSubreddits");

  Object.keys(categories).forEach((mainCategory) => {
    Object.keys(categories[mainCategory]).forEach((subCategory) => {
      Object.keys(categories[mainCategory][subCategory]).forEach(
        async (topicName) => {
          const subredditName =
            categories[mainCategory][subCategory][topicName];

          await insertSubreddit(
            topicName,
            mainCategory,
            subCategory,
            subredditName
          );
        }
      );
    });
  });
}

async function insertSampleUserSubreddits() {
  // await insertUserSubredditByLoginAndTopic("Egg", "Javascript");
  // await insertUserSubredditByLoginAndTopic(
  //   "Egg",
  //   "Counterstrike: Global Offensive"
  // );
  // await insertUserSubredditByLoginAndTopic("Egg", "Genshin Impact");
  userData.users.forEach((userObj) => {
    const username = userObj.username;
    userObj.categories.forEach(async (categoryObj) => {
      const topicName = categoryObj.subSubCategory;
      await insertUserSubredditByLoginAndTopic(username, topicName);
    });
  });
}

async function initializeDbWithSampleData() {
  const usersEmpty = await checkIfTableIsEmpty("Users");
  if (usersEmpty) {
    await insertSampleUsers();
  }

  const subredditsEmpty = await checkIfTableIsEmpty("Subreddits");
  if (subredditsEmpty) {
    await insertSampleSubreddits();
  }

  const userSubredditsEmpty = await checkIfTableIsEmpty("UserSubreddits");
  if (userSubredditsEmpty) {
    await insertSampleUserSubreddits();
  }
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
  const user_id = await getUserIdByLogin(username);
  const subreddit_id = await getSubredditIdByTopic(topic);

  await insertUserSubreddit(user_id, subreddit_id);
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

function getUserIdByLogin(username) {
  return new Promise((resolve, reject) => {
    var sql = "SELECT user_id ";
    sql += "FROM Users ";
    sql += "WHERE username = ? ";

    db.get(sql, username, function (error, row) {
      if (error) {
        reject(error);
      }
      // console.error("User_id");
      // console.error(row.user_id);

      resolve(row.user_id);
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
            password text NOT NULL
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

module.exports.closeDb = closeDb;
