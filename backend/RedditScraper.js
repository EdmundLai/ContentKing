const snoowrap = require("snoowrap");
const { categories } = require("./reddit_categories");

const dbManager = require("./dbManager");

const r = new snoowrap({
  userAgent: process.env.USER_AGENT,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
});

const listingsDict = {};

async function getPostsForUserFromDb(username) {
  const subredditPromises = [];

  // array will be empty if username cannot be found
  const subredditsArr = await dbManager.getUserSubRedditsFromUsername(username);

  if (subredditsArr.length === 0) {
    return null;
  }

  subredditsArr.forEach((subredditObj) => {
    const promise = getSubredditTopPosts(
      subredditObj.subreddit_name,
      subredditObj.topic_name
    );

    subredditPromises.push(promise);
  });

  const categories = await Promise.all(subredditPromises);

  return {
    username: username,
    categories: categories,
  };
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

  if (typeof listing == "undefined") {
    return null;
  }

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

module.exports.fetchMorePosts = fetchMorePosts;

module.exports.getPostsForUserFromDb = getPostsForUserFromDb;
