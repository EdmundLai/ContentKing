import React from "react";

import ButtonAppBar from "../ButtonAppBar/ButtonAppBar";

import Button from "@material-ui/core/Button";

import { useHistory } from "react-router-dom";

export default function LoggedOutAppBar(props) {
  //const { logInCallback } = props;

  const history = useHistory();

  function redirectToLoginPage() {
    history.push("/login");
  }

  function redirectToCreateAccount() {
    history.push("/newaccount");
  }

  const actionButtons = (
    <>
      <Button onClick={redirectToLoginPage} color="inherit">
        Login
      </Button>
      <Button onClick={redirectToCreateAccount} color="inherit">
        Sign Up
      </Button>
    </>
  );

  return <ButtonAppBar buttonMenu={actionButtons} />;
}
