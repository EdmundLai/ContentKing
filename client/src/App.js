//import logo from "./logo.svg";
import React from "react";
import "./App.css";
import ContentFeed from "./components/ContentFeed/ContentFeed";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Container minWidth="sm">
        <Box>
          <ContentFeed />
        </Box>
      </Container>
    </div>
  );
}

export default App;
