import React from "react";

import ButtonAppBar from "../ButtonAppBar/ButtonAppBar";

import { useHistory } from "react-router-dom";

export default function LoggedOutAppBar(props) {
  //const { logInCallback } = props;

  const history = useHistory();

  function redirectToLoginPage() {
    history.push("/login");
  }

  return (
    <ButtonAppBar buttonText="Login" buttonHandler={redirectToLoginPage} />
  );
}
