var axios = require("axios");

async function getUserPosts(username) {
  const res = await axios.get("/api/user", {
    params: {
      username: username,
    },
  });

  return res.data;
}

async function getMorePosts(category) {
  const res = await axios.get("/api/fetchmore", {
    params: {
      category: category,
    },
  });
  return res.data;
}

async function insertUser(username, password) {
  return axios
    .get("/api/setuserinfo", {
      params: {
        username: username,
        password: password,
      },
    })
    .then((res) => {
      console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      return error.data;
    });
}

async function authenticateUser(username, password) {
  return axios
    .get("/api/checkcredentials", {
      params: {
        username: username,
        password: password,
      },
    })
    .then((res) => {
      return res.data;
    });
}

async function getSubreddits() {
  return axios.get("/api/allsubreddits").then((res) => {
    return res.data;
  });
}

async function getUserSubreddits(username) {
  return axios
    .get("/api/usersubreddits", {
      params: {
        username: username,
      },
    })
    .then((res) => {
      return res.data;
    });
}

module.exports.getUserPosts = getUserPosts;

module.exports.getMorePosts = getMorePosts;

module.exports.insertUser = insertUser;

module.exports.authenticateUser = authenticateUser;

module.exports.getSubreddits = getSubreddits;

module.exports.getUserSubreddits = getUserSubreddits;
