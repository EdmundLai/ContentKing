require("dotenv").config();

const { Pool } = require("pg");

const { categories } = require("./reddit_categories");

const connectionString = process.env.DATABASE_URL;

if (process.env.NODE_ENV !== "production") {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false },
});

//insertSampleSubreddits();

// createTables();
//getAllSubreddits();
//getSubredditIdByTopic("Javascript");
//getUserIdByLogin("egg");

async function createTables() {
  return new Promise(async (resolve, reject) => {
    const query = `CREATE TABLE IF NOT EXISTS Subreddits (
            subreddit_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            topic_name text NOT NULL UNIQUE,
            main_category text NOT NULL,
            sub_category text NOT NULL,
            subreddit_name text NOT NULL UNIQUE
        );
        
        CREATE TABLE IF NOT EXISTS Users (
            user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            username text NOT NULL UNIQUE,
            password char(60) NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS UserSubreddits (
            id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            user_id INT NOT NULL,
            subreddit_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES Users(user_id),
            FOREIGN KEY (subreddit_id) REFERENCES Subreddits(subreddit_id)
        );`;

    try {
      const res = await pool.query(query);
      console.log("Table is successfully created");
      resolve();
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

// function works!
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

async function getPasswordFromUsername(username) {
  return new Promise(async (resolve, reject) => {
    var sql = "SELECT password from USERS WHERE username = $1";

    try {
      const res = await pool.query(sql, [username]);
      resolve(res.rows[0]);
    } catch (error) {
      reject(error.stack);
    }
  });
}

async function getAllSubreddits() {
  return new Promise(async (resolve, reject) => {
    var sql = "SELECT topic_name, subreddit_name, main_category, sub_category ";
    sql += "from Subreddits";

    try {
      const res = await pool.query(sql);
      //console.log(res.rows);
      resolve(res.rows);
    } catch (error) {
      reject(error.stack);
    }
  });
}

async function getPasswordFromUsername(username) {
  return new Promise(async (resolve, reject) => {
    var sql = "SELECT password from USERS WHERE username = $1";

    try {
      const res = await pool.query(sql, [username]);
      //console.log(res);
      resolve(res.rows[0]);
    } catch (error) {
      reject(error.stack);
    }
  });
}

function insertUserSubreddit(userId, subredditId) {
  return new Promise(async (resolve, reject) => {
    var sql = "INSERT INTO UserSubreddits (user_id, subreddit_id) ";
    sql += "VALUES ($1, $2) ";

    try {
      const res = await pool.query(sql, [userId, subredditId]);
      resolve(res);
    } catch (error) {
      reject(error.stack);
    }
  });
}

async function getSubredditNamesFromUserId(userId) {
  return new Promise(async (resolve, reject) => {
    var sql = "SELECT topic_name, subreddit_name, main_category, sub_category ";
    sql += "from Subreddits WHERE subreddit_id IN (SELECT subreddit_id ";
    sql += "FROM UserSubreddits ";
    sql += "WHERE user_id = $1) ";

    try {
      const res = await pool.query(sql, [userId]);
      resolve(res.rows);
    } catch (error) {
      reject(error);
    }
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
  return new Promise(async (resolve, reject) => {
    var sql = "SELECT subreddit_id ";
    sql += "FROM Subreddits ";
    sql += "WHERE topic_name = $1 ";

    try {
      const res = await pool.query(sql, [subredditName]);
      //console.log(res.rows[0].subreddit_id);
      resolve(res.rows[0].subreddit_id);
    } catch (error) {
      reject(error);
    }
  });
}

// can be used to check if username exists in the database
async function getUserIdByLogin(username) {
  return new Promise(async (resolve, reject) => {
    var sql = "SELECT user_id ";
    sql += "FROM Users ";
    sql += "WHERE username = $1 ";

    try {
      const res = await pool.query(sql, [username]);
      //console.log(typeof res.rows[0]);
      //console.log(res.rows[0]);
      resolve(res.rows[0]);
    } catch (error) {
      reject(error.stack);
    }
  });
}

async function insertSubreddit(
  topicName,
  mainCategory,
  subCategory,
  subredditName
) {
  return new Promise(async (resolve, reject) => {
    const text =
      "INSERT INTO Subreddits (topic_name, main_category, sub_category, subreddit_name) VALUES($1, $2, $3, $4) RETURNING *";

    const values = [topicName, mainCategory, subCategory, subredditName];

    try {
      const res = await pool.query(text, values);
      resolve(res.rows[0]);
    } catch (err) {
      reject(err.stack);
    }
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

async function registerUser(username, password) {
  return new Promise(async (resolve, reject) => {
    var sql = "INSERT INTO Users (username, password) ";
    sql += "VALUES ($1 , $2) RETURNING *";

    try {
      const res = await pool.query(sql, [username, password]);
      resolve(res.rows[0]);
    } catch (error) {
      reject(error.stack);
    }
  });
}

//module.exports.createTables = createTables;

module.exports.getUserIdByLogin = getUserIdByLogin;

module.exports.getUserSubRedditsFromUsername = getUserSubRedditsFromUsername;

module.exports.getPasswordFromUsername = getPasswordFromUsername;

module.exports.registerUser = registerUser;

module.exports.getAllSubreddits = getAllSubreddits;

module.exports.insertUserSubredditByLoginAndTopic = insertUserSubredditByLoginAndTopic;

module.exports.deleteUserSubredditByLoginAndTopic = deleteUserSubredditByLoginAndTopic;
