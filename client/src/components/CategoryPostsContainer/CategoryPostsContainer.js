import React from "react";
import SimpleCard from "../SimpleCard/SimpleCard";

function CategoryPostsContainer(props) {
  const { categoryPosts } = props;

  return (
    <div className="CategoryPostsContainer">
      {categoryPosts.posts.map((post, index) => {
        return (
          <SimpleCard key={index} cardTitle={post.title} cardLink={post.link} />
        );
      })}
    </div>
  );
}

// function Post(props) {
//   const { post } = props;

//   return (
//     <div>
//       {post.title}
//       <p>
//         <a href={post.link}>{post.link}</a>
//       </p>
//     </div>
//   );
// }

export default CategoryPostsContainer;
