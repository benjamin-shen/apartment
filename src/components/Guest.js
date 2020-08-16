import React, { useContext } from "react";
import { Container } from "react-bootstrap";
import { AuthContext } from "./Auth";
import Nav from "./Nav";
import Back from "./Back";
import SignOut from "./SignOut";
import Wifi from "./Wifi";
import "../styles/Guest.css";

const Guest = () => {
  const { currentUser } = useContext(AuthContext);
  const info = currentUser.displayName || currentUser.email;

  return (
    <div className="guest">
      <Nav>
        <Back />
        <SignOut />
      </Nav>
      <Container>
        <h1>
          Guest
          {info && ": " + info}
        </h1>
        <Wifi />
      </Container>
    </div>
  );
};

export default Guest;
