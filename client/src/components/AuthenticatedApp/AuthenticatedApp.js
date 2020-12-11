import React, { useState, useEffect } from "react";

import { Switch, Route } from "react-router-dom";
import Container from "@material-ui/core/Container";
import LoggedInAppBar from "../LoggedInAppBar/LoggedInAppBar";
import ContentFeed from "../ContentFeed/ContentFeed";

import TopicPicker from "../TopicPicker/TopicPicker";

import RequestHandler from "../RequestHandler/RequestHandler";

import { Link } from "react-router-dom";

export default function AuthenticatedApp(props) {
  const { setLoggedIn, username } = props;

  const [data, setData] = useState(null);

  function logOutCallback() {
    setLoggedIn(false);
  }

  useEffect(() => {
    async function fetchPosts() {
      const newPosts = await RequestHandler.getUserPosts(username);

      console.log(newPosts);

      if (!newPosts.valid) {
        console.error(
          "Data from reddit api is invalid. Username is incorrect."
        );
      } else {
        // console.log("newPosts");
        // console.log(newPosts);

        setData(newPosts);
      }
    }

    fetchPosts();
  }, [username]);

  async function updateStateFromScroll(category) {
    const categoryPosts = await RequestHandler.getMorePosts(category);

    let updated = true;

    setData((prevData) => {
      //console.error(prevData);
      let newData = Object.assign({}, prevData);

      const index = prevData.categories.findIndex(
        (categoryObj) => categoryObj.category === category
      );

      // some error occurred with the fetch more command
      if (categoryPosts == null) {
        console.error(
          "Reddit api was unable to fetch any more posts from the listing."
        );
        updated = false;
        return prevData;
      }

      if (prevData.categories[index].length === categoryPosts.length) {
        updated = false;
      }

      newData.categories[index] = categoryPosts;

      return newData;
    });

    return updated;
  }

  return (
    <Container minWidth="sm" maxWidth="xl">
      <LoggedInAppBar logOutCallback={logOutCallback} />
      <Switch>
        <Route
          path="/topicpicker"
          render={(props) => <TopicPicker {...props} username={username} />}
        />
        <Route
          path="/feed"
          render={(props) => (
            <ContentFeed
              {...props}
              data={data}
              updateCallback={updateStateFromScroll}
            />
          )}
        />
        <Route exact path="/">
          <div className="PersonalWelcome">
            Welcome to Content King, {username}!
            <p>
              Choose your subscribed topics{" "}
              <Link to={"/topicpicker"}>here</Link>
            </p>
            <p>
              Here is your <Link to={"/feed"}>feed</Link>
            </p>
          </div>
        </Route>
      </Switch>
    </Container>
  );
}
