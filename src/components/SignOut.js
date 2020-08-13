import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import app from "./base";
import "../styles/SignOut.css";

function SignOut() {
  return (
    <Link to="/" className="">
      <Button variant="danger" className="signout float-right" onClick={() => app.auth().signOut()}>
        Sign Out
      </Button>
    </Link>
  );
}

export default SignOut;
