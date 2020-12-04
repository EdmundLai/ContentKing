import React from "react";

import CategoryPostsContainer from "../CategoryPostsContainer/CategoryPostsContainer";
import ContentTabs from "../ContentTabs/ContentTabs";

class ContentFeed extends React.Component {
  render() {
    const { data, updateCallback } = this.props;

    if (data == null) {
      return <></>;
    }
    //console.log(data);

    const contentList = data.categories.map((categoryPosts, index) => {
      return (
        <CategoryPostsContainer
          key={index}
          categoryPosts={categoryPosts}
          updateCallback={updateCallback}
        />
      );
    });

    const categoryTitles = data.categories.map(
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
