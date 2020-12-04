//import logo from "./logo.svg";
import React from "react";
import "./App.css";

import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";

import ResponsiveDrawer from "./components/ResponsiveDrawer/ResponsiveDrawer";

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Container minWidth="sm">
        <ResponsiveDrawer />
      </Container>
    </div>
  );
}

export default App;
