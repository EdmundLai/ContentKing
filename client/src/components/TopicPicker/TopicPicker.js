import React, { useEffect, useState } from "react";

import TransferList from "../TransferList/TransferList";

import RequestHandler from "../RequestHandler/RequestHandler";

// just need to categorize the subreddits into tabs and have a/couple picker(s)
// in each tab based on if each picker is by subCategory

// left side is possible choices of subreddits
// right side is chosen subreddits

// (may possibly cap number of chosen subreddits to 6 or 7)
// after user has made choices, compare existing userSubreddits
// in database to chosen subreddits

// remove from database topics that are no longer in chosen list
// add topics that are newly in chosen list
// don't touch topics that haven't changed
export default function TopicPicker(props) {
  const { username } = props;

  // list of all possible subreddits
  const [subredditsList, setSubredditsList] = useState([]);

  // database user subreddits
  const [userSubreddits, setUserSubreddits] = useState([]);

  // user subreddits changed by user input via picker
  // this will be passed to transfer list
  const [userNewSubreddits, setUserNewSubreddits] = useState([]);

  useEffect(() => {
    async function initSubredditStates() {
      const allSubreddits = await RequestHandler.getSubreddits();

      const userSubreddits = await RequestHandler.getUserSubreddits(username);

      //console.log("list of all subreddits");
      setSubredditsList(allSubreddits);
      setUserSubreddits(userSubreddits);
      setUserNewSubreddits(userSubreddits);

      console.log(allSubreddits);

      //console.log("user subreddits:");
      console.log(userSubreddits);
    }

    initSubredditStates();
  }, [username]);

  console.log("hello from topic picker");

  return (
    <div className="TopicPicker">
      <TransferList />
    </div>
  );
}
