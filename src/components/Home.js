import React, { useContext } from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "./Auth";
import SignOut from "./SignOut";
import Doorbell from "./Doorbell";
import "../styles/Home.css";

const address = require("../env.json").app.address;

function Home() {
  const { currentUser, guestUser } = useContext(AuthContext);

  return (
    <div className="home">
      <Container>
        {address && (
          <h1>
            Welcome to<span className="d-md"> </span>
            <br className="d-md-none" />
            <span className="address">{address}</span>
          </h1>
        )}
        <main>
          <Doorbell />

          {currentUser &&
            (guestUser ? (
              <h3>
                You are signed in as<span className="d-md"> </span>
                <br className="d-md-none" />
                <Link to="/guest" className="text-info">
                  {currentUser.displayName || currentUser.email || "a guest"}
                </Link>
                .
              </h3>
            ) : (
              <h3>
                You are signed in as<span className="d-md"> </span>
                <br className="d-md-none" />
                <Link to="/user" className="text-info">
                  {currentUser.displayName || currentUser.email || "a user"}
                </Link>
                .
              </h3>
            ))}
          {currentUser ? (
            <SignOut />
          ) : (
            <div className="login-buttons">
              <Button variant="outline-dark" size="sm" className="login-button">
                <Link to="/guest/login">
                  <h2>Guest Log In</h2>
                </Link>
              </Button>
              <Button variant="outline-dark" size="sm" className="login-button">
                <Link to="/user/login">
                  <h2>House Log In</h2>
                </Link>
              </Button>
            </div>
          )}
        </main>
      </Container>
    </div>
  );
}

export default Home;
