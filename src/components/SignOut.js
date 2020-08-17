import React from "react";
import { Button } from "react-bootstrap";
import app from "./base";
import "../styles/Button.css";

const SignOut = () => {
  return (
    <Button
      variant="danger"
      className="signout float-right"
      onClick={() => app.auth().signOut()}
    >
      Sign Out
    </Button>
  );
};

export default SignOut;
