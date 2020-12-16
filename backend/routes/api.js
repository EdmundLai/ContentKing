const express = require("express");

const router = express.Router();

const authHandler = require("../authHandler");

const scraper = require("../RedditScraper");

const dbManager = require("../postgreDbManager");

router.get("/", (req, res) => {
  res.send("Hello World!");
});

// probably need to implement secure api endpoints or something
router.get("/setuserinfo", async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  if (username.length == 0 || password.length == 0) {
    res.status(400).send({
      valid: false,
      errorMessage: "Username or password cannot be of length 0.",
    });
    return;
  }

  try {
    await authHandler.insertUserCredentials(username, password);
  } catch {
    res
      .status(200)
      .send({ valid: false, errorMessage: "User already exists!" });
    return;
  }
  res.status(200).send({ valid: true, username: username });
});

router.get("/checkcredentials", async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  const statusObj = await authHandler.compareUserCredentials(
    username,
    password
  );

  res.send(statusObj);
});

router.get("/user", async (req, res) => {
  const username = req.query.username;
  //const testUserObj = scraper.findUserData(userData, username);

  const userId = dbManager.getUserIdByLogin(username);

  if (typeof userId == "undefined") {
    res.status(404).send("User data cannot be found");
  } else {
    //const userFeed = await scraper.getPostsForUser(testUserObj);

    const userFeed = await scraper.getPostsForUserFromDb(username);

    res.send(userFeed);
  }
});

router.get("/topicposts", async (req, res) => {
  const topicArr = req.query.topicArr;

  const feed = await scraper.getTopPostsFromTopics(topicArr);

  res.send(feed);
});

router.get("/fetchmore", async (req, res) => {
  const category = req.query.category;

  const data = await scraper.fetchMorePosts(category);

  res.send(data);
});

router.get("/allsubreddits", async (req, res) => {
  try {
    const subredditArr = await dbManager.getAllSubreddits();

    res.send(subredditArr);
  } catch (error) {
    res.send(error);
  }
});

router.get("/usersubreddits", async (req, res) => {
  try {
    const username = req.query.username;

    const subredditsArr = await dbManager.getUserSubRedditsFromUsername(
      username
    );

    res.send(subredditsArr);
  } catch (error) {
    res.send(error);
  }
});

router.get("/usersubreddits/add", async (req, res) => {
  try {
    const username = req.query.username;
    const subredditsArr = req.query.subreddits;
    subredditsArr.forEach(async (topic) => {
      await dbManager.insertUserSubredditByLoginAndTopic(username, topic);
    });
    res.send(true);
  } catch (error) {
    res.send(error);
  }
});

router.get("/usersubreddits/remove", async (req, res) => {
  try {
    const username = req.query.username;
    const subredditsArr = req.query.subreddits;
    subredditsArr.forEach(async (topic) => {
      await dbManager.deleteUserSubredditByLoginAndTopic(username, topic);
    });
    res.send(true);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
