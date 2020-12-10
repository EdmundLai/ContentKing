import React from "react";

import { Switch, Route } from "react-router-dom";
import Container from "@material-ui/core/Container";
import LoggedOutAppBar from "../LoggedOutAppBar/LoggedOutAppBar";

//import WelcomePage from "../WelcomePage/WelcomePage";
import WelcomePage from "../WelcomePage/WelcomePage";
//import ContentFeed from "../ContentFeed/ContentFeed";

// need to create login page as well as create an account page
// routes are /login and /newaccount

import SignIn from "../SignIn/SignIn";
import SignUp from "../SignUp/SignUp";

export default function UnauthenticatedApp(props) {
  const { setLoggedIn } = props;

  function logInCallback() {
    setLoggedIn(true);
  }

  return (
    <Container minWidth="sm" maxWidth="xl">
      <LoggedOutAppBar logInCallback={logInCallback} />
      <Switch>
        <Route path="/login">
          <SignIn />
        </Route>
        <Route path="/newaccount">
          <SignUp />
        </Route>
        <Route exact path="/">
          <WelcomePage />
        </Route>
      </Switch>
    </Container>
  );
}
