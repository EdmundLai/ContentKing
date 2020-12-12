import React, { useEffect, useState } from "react";

import TransferList from "../TransferList/TransferList";

import ContentTabs from "../ContentTabs/ContentTabs";

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

  const [stateTree, setStateTree] = useState({});
  const [categories, setCategories] = useState([]);

  // user subreddits changed by user input via picker
  // this will be passed to transfer list

  useEffect(() => {
    async function initStateTree() {
      const allSubreddits = await RequestHandler.getSubreddits();

      const userSubreddits = await RequestHandler.getUserSubreddits(username);

      //console.log("list of all subreddits");

      //console.log(allSubreddits);

      //console.log("user subreddits:");

      //console.log(userSubreddits);

      const mainCategories = allSubreddits.map(
        (subredditObj) => subredditObj.main_category
      );

      const distinctMainCategories = [...new Set(mainCategories)];

      setCategories(distinctMainCategories);

      //console.log(distinctMainCategories);

      const newStateTree = {};

      //console.log("subreddits in each category");

      distinctMainCategories.forEach((categoryName) => {
        const categorySubreddits = allSubreddits
          .filter((subredditObj) => subredditObj.main_category === categoryName)
          .map((subredditObj) => subredditObj.topic_name);

        const chosenSubreddits = userSubreddits
          .filter((subredditObj) => subredditObj.main_category === categoryName)
          .map((subredditObj) => subredditObj.topic_name);

        //console.log(categorySubreddits);

        const subredditChoices = categorySubreddits.filter(
          (topicName) => !chosenSubreddits.includes(topicName)
        );

        //console.log(subredditChoices);

        //console.log(chosenSubreddits);

        newStateTree[categoryName] = {
          choices: subredditChoices,
          chosen: chosenSubreddits,
        };
      });

      console.log(newStateTree);

      setStateTree(newStateTree);
    }

    initStateTree();
  }, [username]);

  // function makeSelection() {
  //   console.log("User Subreddits");
  //   console.log(userSubreddits);

  //   console.log("new subreddits");
  //   console.log(userNewSubreddits);
  // }

  console.log("hello from topic picker");

  console.log(stateTree);

  const content = Object.keys(stateTree).map((mainCategory) => {
    let leftSide = stateTree[mainCategory].choices;
    let rightSide = stateTree[mainCategory].chosen;

    function setLeft(newChoices) {
      const newStateTree = { ...stateTree };

      newStateTree[mainCategory].choices = newChoices;

      setStateTree(newStateTree);
    }

    function setRight(newChosen) {
      const newStateTree = { ...stateTree };

      newStateTree[mainCategory].chosen = newChosen;

      setStateTree(newStateTree);
    }

    return (
      <TransferList
        left={leftSide}
        setLeft={setLeft}
        right={rightSide}
        setRight={setRight}
      />
    );
  });

  return (
    <div className="TopicPicker">
      <ContentTabs contentList={content} categoryTitles={categories} />
    </div>
  );
}
