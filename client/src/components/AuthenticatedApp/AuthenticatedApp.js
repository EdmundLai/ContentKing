import React, { useState, useEffect, useCallback } from "react";

import { Switch, Route } from "react-router-dom";
import Container from "@material-ui/core/Container";
import LoggedInAppBar from "../LoggedInAppBar/LoggedInAppBar";
import ContentFeed from "../ContentFeed/ContentFeed";

import TopicPicker from "../TopicPicker/TopicPicker";

//import { Link } from "react-router-dom";

const RequestHandler = require("../RequestHandler/RequestHandler");

export default function AuthenticatedApp(props) {
  const { setLoggedIn, setUsername, username, updateCallback } = props;

  const [data, setData] = useState(null);

  //console.log(data);

  //console.log(username);
  //console.log(data);

  function logOutCallback() {
    setLoggedIn(false);
    setUsername(null);
  }

  const fetchPostsCallback = useCallback(() => {
    async function fetchPosts() {
      const newPosts = await RequestHandler.getUserPosts(username);

      //console.log("new posts:");
      //console.log(newPosts);

      if (!newPosts.valid) {
        console.error(
          "Data from reddit api is invalid. Username is incorrect."
        );
      } else {
        // console.log("newPosts");
        // console.log(newPosts);

        setData(newPosts);
      }

      return newPosts;
    }
    return fetchPosts();
  }, [username]);

  useEffect(() => {
    fetchPostsCallback();
  }, [fetchPostsCallback]);

  return (
    <Container minWidth="sm" maxWidth="xl">
      <LoggedInAppBar logOutCallback={logOutCallback} />
      <Switch>
        <Route
          path="/topicpicker"
          render={(props) => (
            <TopicPicker
              {...props}
              username={username}
              fetchPosts={fetchPostsCallback}
            />
          )}
        />
        <Route
          exact
          path="/"
          render={(props) => (
            <ContentFeed
              {...props}
              data={data}
              updateCallback={updateCallback}
              setData={setData}
            />
          )}
        />
      </Switch>
    </Container>
  );
}
