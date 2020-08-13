import React from "react";
import { Container } from "react-bootstrap";
import Nav from "./Nav";
import Back from "./Back";
import SignOut from "./SignOut";
import "../styles/User.css";

const User = () => {
  return (
    <div className="user">
      <Nav>
        <Back />
        <SignOut />
      </Nav>
      <Container>
        <h1>User</h1>
        <h2>content</h2>
      </Container>
    </div>
  );
};

export default User;
