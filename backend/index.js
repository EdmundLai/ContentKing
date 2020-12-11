const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
//const scraper = require("./RedditScraper");

const dbManager = require("./dbManager");

let dbConn = null;

const apiRouter = require("./routes/api");

app.use("/api", apiRouter);

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, async () => {
  dbConn = await dbManager.initializeDb();
  console.log(`Example app listening at http://localhost:${port}`);
});

function shutDown() {
  dbManager.closeDb(dbConn);
}
