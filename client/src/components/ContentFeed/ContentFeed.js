import React from "react";

import RequestHandler from "../RequestHandler/RequestHandler";

class ContentFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: { categories: [] } };
  }

  componentDidMount() {
    RequestHandler.getTestUsersPosts().then((data) => {
      this.setState({ data: data });
    });
  }

  render() {
    return (
      <div className="ContentFeed">
        <div>
          {this.state.data.categories.map((categoryPosts) => {
            return (
              <div>
                {categoryPosts.category}
                {categoryPosts.posts.map((post) => {
                  return (
                    <div>
                      {post.title}
                      <p>
                        <a href={post.link}>{post.link}</a>
                      </p>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default ContentFeed;
