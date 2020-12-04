import React from "react";
import SimpleCard from "../SimpleCard/SimpleCard";

import InfiniteScroll from "react-infinite-scroller";

function CategoryPostsContainer(props) {
  const { categoryPosts, updateCallback } = props;

  async function loadMoreContent() {
    await updateCallback(categoryPosts.category);
    //const categoryObj = RequestHandler.getMorePosts(category);
    //setCategoryPosts(categoryObj);
  }

  const loader = (
    <div className="loader" key={0}>
      Loading ...
    </div>
  );

  return (
    <div className="CategoryPostsContainer">
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMoreContent}
        hasMore={true}
        loader={loader}
      >
        {categoryPosts.posts.map((post, index) => {
          return (
            <SimpleCard
              key={index}
              cardTitle={post.title}
              cardLink={post.link}
            />
          );
        })}
      </InfiniteScroll>
    </div>
  );
}

export default CategoryPostsContainer;
