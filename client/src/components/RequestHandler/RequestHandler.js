var axios = require("axios");

async function getTestUsersPosts() {
  const res = await axios.get("/api/user0db");
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
  axios
    .get("/api/setuserinfo", {
      params: {
        username: username,
        password: password,
      },
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports.getTestUsersPosts = getTestUsersPosts;

module.exports.getMorePosts = getMorePosts;

module.exports.insertUser = insertUser;
