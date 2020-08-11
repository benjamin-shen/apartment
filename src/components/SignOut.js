import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import app from "./base";
import "../styles/SignOut.css";

function SignOut() {
  return (
    <Link to="/" className="signout">
      <Button variant="danger" onClick={() => app.auth().signOut()}>
        <h4>Sign Out</h4>
      </Button>
    </Link>
  );
}

export default SignOut;
