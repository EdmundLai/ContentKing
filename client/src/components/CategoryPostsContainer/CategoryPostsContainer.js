import React, { useState } from "react";
import SimpleCard from "../SimpleCard/SimpleCard";
import Grid from "@material-ui/core/Grid";

import InfiniteScroll from "react-infinite-scroller";

function CategoryPostsContainer(props) {
  const { categoryPosts, updateCallback, setData } = props;

  const [contentAvailable, setContentAvailable] = useState(true);

  async function loadMoreContent() {
    const morePostsLoaded = await updateCallback(
      categoryPosts.category,
      setData
    );

    setContentAvailable(morePostsLoaded);
  }

  const loader = (
    <div className="loader" key={0}>
      Loading ...
    </div>
  );

  //console.log(categoryPosts);

  return (
    <div className="CategoryPostsContainer">
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMoreContent}
        hasMore={contentAvailable}
        loader={loader}
      >
        <Grid container spacing={3}>
          {categoryPosts.posts.map((post, index) => {
            return (
              <Grid item xs={12} sm={6}>
                <SimpleCard key={index} post={post} />
              </Grid>
            );
          })}
        </Grid>
      </InfiniteScroll>
    </div>
  );
}

export default CategoryPostsContainer;
