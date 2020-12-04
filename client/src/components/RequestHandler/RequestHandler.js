var axios = require("axios");

async function getTestUsersPosts() {
  const res = await axios.get("/user0");
  return res.data;
}

async function getMorePosts(category) {
  const res = await axios.get("/fetchmore", {
    params: {
      category: category,
    },
  });
  return res.data;
}

module.exports.getTestUsersPosts = getTestUsersPosts;

module.exports.getMorePosts = getMorePosts;
