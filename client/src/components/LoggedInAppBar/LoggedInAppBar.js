import React from "react";

import ButtonAppBar from "../ButtonAppBar/ButtonAppBar";

export default function LoggedInAppBar(props) {
  const { logOutCallback } = props;

  return (
    <ButtonAppBar buttonText="Logout" buttonHandler={logOutCallback} showMenu />
  );
}
