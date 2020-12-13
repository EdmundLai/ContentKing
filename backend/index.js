const express = require("express");
require("dotenv").config();
const app = express();
const path = require("path");
const port = process.env.PORT || 5000;

const cors = require("cors");

const rootDir = path.join(__dirname, "../");

const apiRouter = require("./routes/api");

app.use(express.static(path.join(rootDir, "client/build")));

app.use(cors());

app.use("/api", apiRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(rootDir, "client/build", "index.html"));
});

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
