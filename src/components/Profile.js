import React, { useContext, useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { withRouter, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";
import app from "./base";
import Nav from "./Nav";
import Back from "./Back";
import SignOut from "./SignOut";
import "../styles/Profile.css";

const Profile = ({ history }) => {
  const [error, setError] = useState("");

  const { currentUser, guestUser } = useContext(AuthContext);
  const info = currentUser.displayName || currentUser.email;

  return (
    <div className="profile">
      <Helmet>
        <meta charSet="utf-8" />
        {info && <title>{info}</title>}
        {info && <meta name="title" content={info} />}
      </Helmet>
      <Nav>
        <Back link={guestUser ? "/guest" : "/user"} />
        <SignOut />
      </Nav>
      <Container>
        <h1>{guestUser ? "Guest" : "User"} Profile</h1>
      </Container>
    </div>
  );
};

export default withRouter(Profile);
