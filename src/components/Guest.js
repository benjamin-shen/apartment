import React from "react";
import { Container } from "react-bootstrap";
import Back from "./Back";
import SignOut from "./SignOut";
import "../styles/Guest.css";

const Guest = () => {
  return (
    <div className="guest">
      <Back />
      <SignOut />
      <Container>
        <h1>Guest</h1>
      </Container>
    </div>
  );
};

export default Guest;
