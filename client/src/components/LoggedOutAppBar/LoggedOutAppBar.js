import React from "react";

import ButtonAppBar from "../ButtonAppBar/ButtonAppBar";

export default function LoggedOutAppBar(props) {
  const { logInCallback } = props;

  return <ButtonAppBar buttonText="Login" buttonHandler={logInCallback} />;
}
