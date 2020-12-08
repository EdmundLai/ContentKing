const express = require("express");
require("dotenv").config();
const app = express();
const port = 5000;
const scraper = require("./RedditScraper");

const dbManager = require("./dbManager");

let dbConn = null;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.get("/user0", async (req, res) => {
//   const testUserObj = scraper.findUserData(userData, "Egg");

//   if (testUserObj == null) {
//     res.status(404).send("User data cannot be found");
//   } else {
//     const userFeed = await scraper.getPostsForUser(testUserObj);

//     res.send(userFeed);
//   }
// });

app.get("/user0db", async (req, res) => {
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

app.get("/fetchmore", async (req, res) => {
  const category = req.query.category;

  const data = await scraper.fetchMorePosts(category);

  res.send(data);
  //await scraper.
});

app.get("/csgo", async (req, res) => {
  const data = await scraper.getSubredditTopPosts("globaloffensive");

  res.send(data);
});

app.get("/csharp", async (req, res) => {
  const data = await scraper.getSubredditTopPosts("csharp");

  res.send(data);
});

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

app.listen(port, async () => {
  dbConn = await dbManager.initializeDb();
  console.log(`Example app listening at http://localhost:${port}`);
});

function shutDown() {
  dbManager.closeDb(dbConn);
}
