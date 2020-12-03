import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
//import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
//import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import styles from "./SimpleCard.module.css";

var GifPlayer = require("react-gif-player");

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginBottom: "2rem",
    backgroundColor: "lightgrey",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
  },
  image: {
    maxWidth: "100%",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: "1rem",
  },
  pos: {
    marginBottom: 12,
  },
});

export default function SimpleCard(props) {
  const classes = useStyles();
  //const bull = <span className={classes.bullet}>•</span>;

  const { cardTitle, cardLink } = props;

  function checkURLIsImg(url) {
    return url.match(/\.(jpeg|jpg|png)$/) != null;
  }

  function checkURLIsGif(url) {
    return url.match(/\.(gif)$/) != null;
  }

  let linkContent = <></>;

  if (checkURLIsGif(cardLink)) {
    linkContent = <GifPlayer className={styles.GifPlayer} gif={cardLink} />;
  } else {
    linkContent = checkURLIsImg(cardLink) ? (
      <Box className={classes.imageContainer}>
        <img className={classes.image} src={cardLink} alt="linkImage" />
      </Box>
    ) : (
      <Typography variant="body2" component="p">
        <a href={cardLink}>{cardLink}</a>
      </Typography>
    );
  }

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {cardTitle}
        </Typography>
        {linkContent}
      </CardContent>
    </Card>
  );
}
