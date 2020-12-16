import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
}));

export default function WelcomePage() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      {/* Hero unit */}
      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography
          variant="h6"
          align="center"
          color="textSecondary"
          component="p"
        >
          Please{" "}
          <Link className={classes.link} to="/login">
            log in
          </Link>{" "}
          or{" "}
          <Link className={classes.link} to="/newaccount">
            create
          </Link>{" "}
          an account to customize your content.
        </Typography>
      </Container>
      {/* End hero unit */}
    </React.Fragment>
  );
}
