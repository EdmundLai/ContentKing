import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

import SimpleMenu from "../SimpleMenu/SimpleMenu";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  link: {
    textDecoration: "inherit",
    color: "inherit",
  },
}));

export default function ButtonAppBar(props) {
  const classes = useStyles();

  const { buttonMenu, showMenu } = props;

  const menuObj = showMenu ? <SimpleMenu /> : <></>;

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {menuObj}
          <Typography variant="h6" className={classes.title}>
            <Link className={classes.link} to="/">
              Content King
            </Link>
          </Typography>
          {buttonMenu}
        </Toolbar>
      </AppBar>
    </div>
  );
}
