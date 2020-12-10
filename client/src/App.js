import React, { useEffect, useState } from "react";

import CssBaseline from "@material-ui/core/CssBaseline";

import { BrowserRouter as Router } from "react-router-dom";

import RequestHandler from "./components/RequestHandler/RequestHandler";

import AuthenticatedApp from "./components/AuthenticatedApp/AuthenticatedApp";
import UnauthenticatedApp from "./components/UnauthenticatedApp/UnauthenticatedApp";

function App() {
  const [data, setData] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    //fetchPosts();
  }, []);

  async function fetchPosts() {
    const newPosts = await RequestHandler.getTestUsersPosts();

    if (newPosts == null) {
      console.error(
        "Data from reddit api is invalid. Username may be incorrect."
      );
    }
    // console.log("newPosts");
    // console.log(newPosts);

    setData(newPosts);
  }

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

  const AppContent = loggedIn ? (
    <AuthenticatedApp
      data={data}
      updateCallback={updateStateFromScroll}
      setLoggedIn={setLoggedIn}
    />
  ) : (
    <UnauthenticatedApp setLoggedIn={setLoggedIn} setUsername={setUsername} />
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
