import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
// import IconButton from "@material-ui/core/IconButton";
// import MenuIcon from "@material-ui/icons/Menu";

import SimpleMenu from "../SimpleMenu/SimpleMenu";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar(props) {
  const classes = useStyles();

  const { buttonText, buttonHandler, showMenu } = props;

  const menuObj = showMenu ? <SimpleMenu /> : <></>;

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {menuObj}
          <Typography variant="h6" className={classes.title}>
            RCA
          </Typography>
          <Button onClick={buttonHandler} color="inherit">
            {buttonText}
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
