import React from "react";

import { Switch, Route } from "react-router-dom";
import Container from "@material-ui/core/Container";
import LoggedOutAppBar from "../LoggedOutAppBar/LoggedOutAppBar";
//import ContentFeed from "../ContentFeed/ContentFeed";

// need to create login page as well as create an account page
// routes should be /login and /user/new
export default function UnauthenticatedApp(props) {
  const { setLoggedIn } = props;

  function logInCallback() {
    setLoggedIn(true);
  }

  return (
    <Container minWidth="sm" maxWidth="xl">
      <LoggedOutAppBar logInCallback={logInCallback} />
      <Switch>
        <Route exact path="/">
          <h1>Welcome to Reddit Content Aggregator!</h1>
          <p>Please log in or create an account to subscribe to content.</p>
        </Route>
      </Switch>
    </Container>
  );
}
