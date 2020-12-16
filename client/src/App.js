import React, { useEffect, useState } from "react";

import Cookies from "js-cookie";

import CssBaseline from "@material-ui/core/CssBaseline";

import { BrowserRouter as Router } from "react-router-dom";

import AuthenticatedApp from "./components/AuthenticatedApp/AuthenticatedApp";
import UnauthenticatedApp from "./components/UnauthenticatedApp/UnauthenticatedApp";

const RequestHandler = require("./components/RequestHandler/RequestHandler");

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const loggedInUser = Cookies.get("username");

    if (typeof loggedInUser !== "undefined") {
      setLoggedIn(true);
      setUsername(loggedInUser);
    }
  }, []);

  async function updateStateFromScroll(category, setData) {
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

  const AppContent = loggedIn ? (
    <AuthenticatedApp
      setLoggedIn={setLoggedIn}
      setUsername={setUsername}
      username={username}
      updateCallback={updateStateFromScroll}
    />
  ) : (
    <UnauthenticatedApp
      setLoggedIn={setLoggedIn}
      setUsername={setUsername}
      updateCallback={updateStateFromScroll}
    />
  );

  return (
    <Router>
      <div className="App">
        <CssBaseline />
        {AppContent}
      </div>
    </Router>
  );
}

export default App;
