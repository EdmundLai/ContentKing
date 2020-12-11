import React, { useState } from "react";

import CssBaseline from "@material-ui/core/CssBaseline";

import { BrowserRouter as Router } from "react-router-dom";

//import RequestHandler from "./components/RequestHandler/RequestHandler";

import AuthenticatedApp from "./components/AuthenticatedApp/AuthenticatedApp";
import UnauthenticatedApp from "./components/UnauthenticatedApp/UnauthenticatedApp";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);

  const AppContent = loggedIn ? (
    <AuthenticatedApp setLoggedIn={setLoggedIn} username={username} />
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
