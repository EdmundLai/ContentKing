const snoowrap = require("snoowrap");
const { categories } = require("./reddit_categories");

const r = new snoowrap({
  userAgent: process.env.USER_AGENT,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
});

const listingsDict = {};

async function scrapeSubreddit() {
  const subreddit = await r.getSubreddit("realEstate");
  const topPosts = await subreddit.getTop({ time: "week", limit: 3 });

  let data = [];

  topPosts.forEach((post) => {
    data.push({
      link: post.url,
      text: post.title,
      score: post.score,
    });
  });

  //console.log(data);
}

function findUserData(usersContainer, username) {
  const usersArray = usersContainer.users;

  for (let i = 0; i < usersArray.length; i++) {
    const userObj = usersArray[i];
    if (userObj.username === username) {
      return userObj;
    }
  }

  return null;
}

async function getPostsForUser(userObj) {
  const subredditPromises = [];

  userObj.categories.forEach((category) => {
    const subredditName = getSubredditNameFromCategory(category);
    const promise = getSubredditTopPosts(
      subredditName,
      category.subSubCategory
    );

    subredditPromises.push(promise);
  });

  const categories = await Promise.all(subredditPromises);

  return {
    username: userObj.username,
    categories: categories,
  };
}

function getSubredditNameFromCategory(category) {
  return categories[category.mainCategory][category.subCategory][
    category.subSubCategory
  ];
}

async function getSubredditTopPosts(subredditName, category) {
  const subreddit = r.getSubreddit(subredditName);
  const listing = await subreddit.getTop({ time: "week", limit: 30 });

  //console.log(typeof listing);

  let data = [];

  listing.forEach((post) => {
    //console.log(post);
    data.push({
      thumbnail: post.thumbnail,
      permalink: post.permalink,
      link: post.url,
      title: post.title,
      score: post.score,
      text: post.selftext,
    });

    //console.log("top posts before exiting getTopPosts");
    //console.log(typeof listingsDict[category]);
  });

  listingsDict[category] = listing;

  //console.log(data);
  //console.log("top posts loaded!");

  return {
    category: category,
    posts: data,
  };
}

async function fetchMorePosts(category) {
  const listing = listingsDict[category];

  let data = [];

  const moreTopPosts = await listing.fetchMore({ amount: 25 });
  moreTopPosts.forEach((post) => {
    data.push({
      link: post.url,
      title: post.title,
      score: post.score,
      text: post.selftext,
    });
  });

  listingsDict[category] = moreTopPosts;

  //console.log("more posts fetched!");

  return {
    category: category,
    posts: data,
  };
}

module.exports.getSubredditTopPosts = getSubredditTopPosts;

module.exports.getPostsForUser = getPostsForUser;

module.exports.fetchMorePosts = fetchMorePosts;

module.exports.findUserData = findUserData;
