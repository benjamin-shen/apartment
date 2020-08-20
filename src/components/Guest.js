import React, { useContext } from "react";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { AuthContext } from "./Auth";
import Nav from "./Nav";
import Back from "./Back";
import View from "./View";
import ProfileButton from "./ProfileButton";
import Show from "./Show";
import Doorbell from "./Doorbell";
import Notes from "./Notes";
import Wifi from "./Wifi";
import "../styles/Guest.css";

const Guest = () => {
  const { currentUser, guestUser } = useContext(AuthContext);
  const info = currentUser.displayName || currentUser.email;

  return (
    <div className="guest">
      <Helmet>
        {info && <title>{info}</title>}
        {info && <meta name="title" content={info} />}
      </Helmet>
      <Nav>
        <Back />
        {!guestUser && <View text="Back to User Page" link="/user" />}
        <ProfileButton link={(guestUser ? "/guest" : "/user") + "/profile"} />
      </Nav>
      <Container>
        <h1>
          Guest
          {info && ": " + info}
        </h1>
        <Notes type="guest" document="info" />
        <Show text="Show Guest Wifi">
          <Wifi />
        </Show>
        <Doorbell />
      </Container>
    </div>
  );
};

export default Guest;
