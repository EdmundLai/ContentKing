const snoowrap = require("snoowrap");
const { categories } = require("./reddit_categories");

const r = new snoowrap({
  userAgent: process.env.USER_AGENT,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
});

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

  console.log(data);
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
  const subreddit = await r.getSubreddit(subredditName);

  const topPosts = await subreddit.getTop({ time: "week", limit: 5 });

  let data = [];

  topPosts.forEach((post) => {
    data.push({
      link: post.url,
      title: post.title,
      score: post.score,
      text: post.selftext,
    });
  });

  return {
    category: category,
    posts: data,
  };
}

module.exports.getSubredditTopPosts = getSubredditTopPosts;

module.exports.getPostsForUser = getPostsForUser;
