import { get } from "axios";

async function getUserPosts(username) {
  const res = await get("/api/user", {
    params: {
      username: username,
    },
  });

  return res.data;
}

async function getMorePosts(category) {
  const res = await get("/api/fetchmore", {
    params: {
      category: category,
    },
  });
  return res.data;
}

async function insertUser(username, password) {
  return get("/api/setuserinfo", {
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
  return get("/api/checkcredentials", {
    params: {
      username: username,
      password: password,
    },
  }).then((res) => {
    return res.data;
  });
}

async function getSubreddits() {
  return get("/api/allsubreddits").then((res) => {
    return res.data;
  });
}

async function getUserSubreddits(username) {
  return get("/api/usersubreddits", {
    params: {
      username: username,
    },
  }).then((res) => {
    return res.data;
  });
}

async function insertUserSubreddits(username, subreddits) {
  return get("/api/usersubreddits/add", {
    params: {
      username: username,
      subreddits: subreddits,
    },
  });
}

async function deleteUserSubreddits(username, subreddits) {
  return get("/api/usersubreddits/remove", {
    params: {
      username: username,
      subreddits: subreddits,
    },
  });
}

export {
  getUserPosts,
  getMorePosts,
  insertUser,
  authenticateUser,
  getSubreddits,
  getUserSubreddits,
  insertUserSubreddits,
  deleteUserSubreddits,
};
