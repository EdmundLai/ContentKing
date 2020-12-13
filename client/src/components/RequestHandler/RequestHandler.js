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

const _getUserPosts = getUserPosts;
export { _getUserPosts as getUserPosts };

const _getMorePosts = getMorePosts;
export { _getMorePosts as getMorePosts };

const _insertUser = insertUser;
export { _insertUser as insertUser };

const _authenticateUser = authenticateUser;
export { _authenticateUser as authenticateUser };

const _getSubreddits = getSubreddits;
export { _getSubreddits as getSubreddits };

const _getUserSubreddits = getUserSubreddits;
export { _getUserSubreddits as getUserSubreddits };

const _insertUserSubreddits = insertUserSubreddits;
export { _insertUserSubreddits as insertUserSubreddits };

const _deleteUserSubreddits = deleteUserSubreddits;
export { _deleteUserSubreddits as deleteUserSubreddits };
