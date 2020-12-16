import React from "react";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import CategoryPostsContainer from "../CategoryPostsContainer/CategoryPostsContainer";

import ContentTabs from "../ContentTabs/ContentTabs";

const useStyles = makeStyles((theme) => ({
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
}));
function ContentFeed(props) {
  const classes = useStyles();

  const { data, updateCallback, setData } = props;

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
        setData={setData}
      />
    );
  });

  const categoryTitles = data.categories.map(
    (categoryPosts) => categoryPosts.category
  );

  const tryAddingCategories = (
    <Container maxWidth="sm" component="main" className={classes.heroContent}>
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="textPrimary"
        gutterBottom
      >
        Content King
      </Typography>
      <Typography
        variant="h5"
        align="center"
        color="textSecondary"
        component="p"
      >
        Try adding some new categories!
        {/* <Link className={classes.link} to="/login">
        log in
      </Link> */}
      </Typography>
    </Container>
  );

  const contentTabs = (
    <ContentTabs contentList={contentList} categoryTitles={categoryTitles} />
  );

  const feedContents =
    categoryTitles.length === 0 ? tryAddingCategories : contentTabs;

  return <div className="ContentFeed">{feedContents}</div>;
}

export default ContentFeed;
