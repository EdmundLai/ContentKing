//import logo from "./logo.svg";
import React from "react";
import "./App.css";

import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";

//import ResponsiveDrawer from "./components/ResponsiveDrawer/ResponsiveDrawer";
import ContentFeed from "./components/ContentFeed/ContentFeed";

import RequestHandler from "./components/RequestHandler/RequestHandler";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { data: null };

    this.updateStateFromScroll = this.updateStateFromScroll.bind(this);
  }

  async componentDidMount() {
    const data = await RequestHandler.getTestUsersPosts();

    this.setState({ data: data });
  }

  async updateStateFromScroll(category) {
    const categoryPosts = await RequestHandler.getMorePosts(category);

    this.setState((prevState) => {
      let newData = Object.assign({}, prevState.data);
      // console.log(categoryPosts);
      // console.log(newData);
      const index = prevState.data.categories.findIndex(
        (categoryObj) => categoryObj.category === category
      );

      newData.categories[index] = categoryPosts;

      return {
        data: newData,
      };
    });
  }

  render() {
    //console.log(this.state.data);

    return (
      <div className="App">
        <CssBaseline />
        <Container minWidth="sm">
          <ContentFeed
            data={this.state.data}
            updateCallback={this.updateStateFromScroll}
          />
        </Container>
      </div>
    );
  }
}

export default App;
