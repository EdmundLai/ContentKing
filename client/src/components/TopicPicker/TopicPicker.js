import React, { useEffect, useState } from "react";

import TransferList from "../TransferList/TransferList";

import ContentTabs from "../ContentTabs/ContentTabs";

import RequestHandler from "../RequestHandler/RequestHandler";

import Button from "@material-ui/core/Button";

import { useHistory } from "react-router-dom";

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
  const { username, fetchPosts } = props;

  const [stateTree, setStateTree] = useState({});
  const [categories, setCategories] = useState([]);

  const [originalUserTopics, setOriginalUserTopics] = useState([]);

  const history = useHistory();

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

      const origTopics = userSubreddits.map(
        (subredditObj) => subredditObj.topic_name
      );

      setOriginalUserTopics(origTopics);

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

  function getUserChosenTopics() {
    let chosenTopicsArr = [];

    Object.keys(stateTree).forEach((category) => {
      const categoryChosen = stateTree[category].chosen;
      // console.log(categoryChosen);
      chosenTopicsArr = chosenTopicsArr.concat(categoryChosen);
    });
    //console.log(chosenTopicsArr);

    return chosenTopicsArr;
  }

  // function makeSelection() {
  //   console.log("User Subreddits");
  //   console.log(userSubreddits);

  //   console.log("new subreddits");
  //   console.log(userNewSubreddits);
  // }

  console.log("hello from topic picker");

  //console.log(stateTree);

  async function changeUserTopics() {
    const chosenArr = getUserChosenTopics();

    const addedTopics = chosenArr.filter(
      (topic) => !originalUserTopics.includes(topic)
    );

    const removedTopics = originalUserTopics.filter(
      (topic) => !chosenArr.includes(topic)
    );

    //console.log(addedTopics);

    //console.log(removedTopics);

    await RequestHandler.deleteUserSubreddits(username, removedTopics);

    await RequestHandler.insertUserSubreddits(username, addedTopics);

    fetchPosts();

    history.push("/feed");
  }

  //console.log(chosenArr);

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
      <Button onClick={changeUserTopics} variant="contained" color="primary">
        Submit
      </Button>
    </div>
  );
}
