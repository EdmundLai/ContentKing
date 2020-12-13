import React from "react";

import ButtonAppBar from "../ButtonAppBar/ButtonAppBar";

import { useHistory } from "react-router-dom";

export default function LoggedInAppBar(props) {
  const history = useHistory();

  const { logOutCallback } = props;

  function handleLogOut() {
    logOutCallback();

    history.push("/");
  }

  return (
    <ButtonAppBar buttonText="Logout" buttonHandler={handleLogOut} showMenu />
  );
}
