import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

var GifPlayer = require("react-gif-player");

const useStyles = makeStyles({
  root: {
    marginBottom: "2rem",
    backgroundColor: "lightgrey",
    maxHeight: "500px",
  },
  imageContainer: {
    display: "flex",
    alignSelf: "center",
    flexGrow: "2",
    height: "100%",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "max(30vh,400px)",
  },
  imageLink: {
    alignSelf: "center",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: "1rem",
  },
  titleLink: {
    color: "inherit",
    textDecoration: "inherit",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  pos: {
    marginBottom: 12,
  },
  gifPlayer: {
    maxWidth: "100%",
  },
});

export default function SimpleCard(props) {
  const classes = useStyles();
  //const bull = <span className={classes.bullet}>•</span>;

  const { post } = props;

  const cardTitle = post.title;
  const cardLink = post.link;

  const redditLink = `https://www.reddit.com${post.permalink}`;

  function checkURLIsImg(url) {
    return url.match(/\.(jpeg|jpg|png)$/) != null;
  }

  function checkURLIsGif(url) {
    return url.match(/\.(gif)$/) != null;
  }

  let linkContent = <></>;

  if (checkURLIsGif(cardLink)) {
    linkContent = <GifPlayer className={classes.gifPlayer} gif={cardLink} />;
  } else if (checkURLIsImg(cardLink)) {
    linkContent = (
      <Box className={classes.imageContainer}>
        <a className={classes.imageLink} href={cardLink}>
          <img className={classes.image} src={cardLink} alt="linkImage" />
        </a>
      </Box>
    );
  } else {
    linkContent = (
      <Typography variant="body2" component="p">
        <a href={cardLink}>{cardLink}</a>
      </Typography>
    );
  }

  return (
    <Card className={classes.root}>
      <CardContent className={classes.cardContent}>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          <a className={classes.titleLink} href={redditLink}>
            {cardTitle}
          </a>
        </Typography>
        {linkContent}
      </CardContent>
    </Card>
  );
}
