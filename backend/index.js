const express = require("express");
require("dotenv").config();
const app = express();
const port = 5000;
const scraper = require("./RedditScraper");
const { userData } = require("./user_prefs");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/user0", async (req, res) => {
  const userFeed = await scraper.getPostsForUser(userData.users[0]);

  res.send(userFeed);
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
