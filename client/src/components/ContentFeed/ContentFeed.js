import React from "react";

import RequestHandler from "../RequestHandler/RequestHandler";
import CategoryPostsContainer from "../CategoryPostsContainer/CategoryPostsContainer";
import ContentTabs from "../ContentTabs/ContentTabs";

class ContentFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }

  componentDidMount() {
    RequestHandler.getTestUsersPosts().then((data) => {
      this.setState({ data: data });
    });
  }

  render() {
    if (this.state.data == null) {
      return <></>;
    }

    const contentList = this.state.data.categories.map(
      (categoryPosts, index) => {
        return (
          <CategoryPostsContainer key={index} categoryPosts={categoryPosts} />
        );
      }
    );

    const categoryTitles = this.state.data.categories.map(
      (categoryPosts) => categoryPosts.category
    );

    return (
      <div className="ContentFeed">
        <ContentTabs
          contentList={contentList}
          categoryTitles={categoryTitles}
        />
      </div>
    );
  }
}

export default ContentFeed;
