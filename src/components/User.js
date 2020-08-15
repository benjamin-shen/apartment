import React, { useContext } from "react";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { AuthContext } from "./Auth";
import Nav from "./Nav";
import Back from "./Back";
import SignOut from "./SignOut";
import Log from "./Log";
import "../styles/User.css";

const User = () => {
  const { currentUser } = useContext(AuthContext);
  const info = currentUser.displayName || currentUser.email;

  return (
    <div className="user">
      <Helmet>
        <meta charSet="utf-8" />
        {info && <title>{info}</title>}
        {info && <meta name="title" content={info} />}
      </Helmet>
      <Nav>
        <Back />
        <SignOut />
      </Nav>
      <Container>
        <h1>
          User{": " + currentUser.displayName || ": " + currentUser.email}
        </h1>
        <Log type="doorbell" />
      </Container>
    </div>
  );
};

export default User;
