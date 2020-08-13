import React from "react";
import { Container } from "react-bootstrap";
import Nav from "./Nav";
import Back from "./Back";
import SignOut from "./SignOut";
import "../styles/Guest.css";

const Guest = () => {
  return (
    <div className="guest">
      <Nav>
        <Back />
        <SignOut />
      </Nav>
      <Container>
        <h1>Guest</h1>
      </Container>
    </div>
  );
};

export default Guest;
