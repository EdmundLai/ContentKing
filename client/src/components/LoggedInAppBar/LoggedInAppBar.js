import React from "react";

import ButtonAppBar from "../ButtonAppBar/ButtonAppBar";

import Button from "@material-ui/core/Button";

import Cookies from "js-cookie";

import { useHistory } from "react-router-dom";

export default function LoggedInAppBar(props) {
  const history = useHistory();

  const { logOutCallback } = props;

  function handleLogOut() {
    logOutCallback();

    Cookies.remove("username");

    history.push("/");
  }

  const actionButtons = (
    <Button onClick={handleLogOut} color="inherit">
      Logout
    </Button>
  );

  return <ButtonAppBar buttonMenu={actionButtons} showMenu />;
}
