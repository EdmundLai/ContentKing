var axios = require("axios");

function getTestUsersPosts() {
  return axios.get("/user0").then((res) => {
    return res.data;
  });
}

module.exports.getTestUsersPosts = getTestUsersPosts;
