import React from "react";

import { Switch, Route } from "react-router-dom";
import Container from "@material-ui/core/Container";
import LoggedInAppBar from "../LoggedInAppBar/LoggedInAppBar";
import ContentFeed from "../ContentFeed/ContentFeed";

export default function AuthenticatedApp(props) {
  const { data, updateCallback, setLoggedIn } = props;

  function logOutCallback() {
    setLoggedIn(false);
  }

  return (
    <Container minWidth="sm" maxWidth="xl">
      <LoggedInAppBar logOutCallback={logOutCallback} />
      <Switch>
        <Route
          exact
          path="/"
          render={(props) => (
            <ContentFeed
              {...props}
              data={data}
              updateCallback={updateCallback}
            />
          )}
        />
      </Switch>
    </Container>
  );
}
