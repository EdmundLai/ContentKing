const express = require("express");

const router = express.Router();

const authHandler = require("../authHandler");

router.get("/", (req, res) => {
  res.send("Hello World!");
});

// probably need to implement secure api endpoints or something
router.get("/setuserinfo", async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  if (username.length == 0 || password.length == 0) {
    res
      .status(400)
      .send({
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

// router.get("/user0", async (req, res) => {
//   const testUserObj = scraper.findUserData(userData, "Egg");

//   if (testUserObj == null) {
//     res.status(404).send("User data cannot be found");
//   } else {
//     const userFeed = await scraper.getPostsForUser(testUserObj);

//     res.send(userFeed);
//   }
// });

router.get("/user0db", async (req, res) => {
  const username = "Egg";
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

router.get("/fetchmore", async (req, res) => {
  const category = req.query.category;

  const data = await scraper.fetchMorePosts(category);

  res.send(data);
  //await scraper.
});

router.get("/csgo", async (req, res) => {
  const data = await scraper.getSubredditTopPosts("globaloffensive");

  res.send(data);
});

router.get("/csharp", async (req, res) => {
  const data = await scraper.getSubredditTopPosts("csharp");

  res.send(data);
});

module.exports = router;
