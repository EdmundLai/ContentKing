import React, { useEffect, useState } from "react";

import { Switch, Route } from "react-router-dom";
import Container from "@material-ui/core/Container";
import LoggedOutAppBar from "../LoggedOutAppBar/LoggedOutAppBar";

import WelcomePage from "../WelcomePage/WelcomePage";

import ContentFeed from "../ContentFeed/ContentFeed";

// import TopicPicker from "../TopicPicker/TopicPicker";

// need to create login page as well as create an account page
// routes are /login and /newaccount

import SignIn from "../SignIn/SignIn";
import SignUp from "../SignUp/SignUp";

const RequestHandler = require("../RequestHandler/RequestHandler");

export default function UnauthenticatedApp(props) {
  const { setLoggedIn, setUsername, updateCallback } = props;

  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchPresetTopicPosts() {
      const topicArr = ["Pokemon", "Genshin Impact", "Game Deals"];
      const newFeed = await RequestHandler.getTopicsPosts(topicArr);

      setData(newFeed);

      return newFeed;
    }
    fetchPresetTopicPosts();
  }, []);

  function logInCallback(username) {
    setLoggedIn(true);
    setUsername(username);
  }

  return (
    <Container minWidth="sm" maxWidth="xl">
      <LoggedOutAppBar />
      <Switch>
        <Route path="/login">
          <SignIn logInCallback={logInCallback} />
        </Route>
        <Route path="/newaccount">
          <SignUp logInCallback={logInCallback} />
        </Route>
        <Route
          exact
          path="/"
          render={(props) => (
            <>
              <WelcomePage />
              <ContentFeed
                {...props}
                data={data}
                updateCallback={updateCallback}
                setData={setData}
              />
            </>
          )}
        />
      </Switch>
    </Container>
  );
}
