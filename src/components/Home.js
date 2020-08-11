import React, { useContext } from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "./Auth";
import Doorbell from "./Doorbell";
import SignOut from "./SignOut";
import "../styles/Home.css";

function Home() {
  const { currentUser, guestUser } = useContext(AuthContext);

  return (
    <div className="home">
      <Container>
        <header>
          <h1>Welcome to 401 Eddy St Apt B</h1>
        </header>
        <main>
          <div className="doorbell-button">
            <Doorbell />
          </div>

          {currentUser &&
            (guestUser ? (
              <h3>
                You are signed in as a{" "}
                <Link to="/guest" className="text-info">
                  guest
                </Link>
                .
              </h3>
            ) : (
              <h3>
                You are signed in as a{" "}
                <Link to="/user" className="text-info">
                  user
                </Link>
                .
              </h3>
            ))}
          {currentUser ? (
            <SignOut />
          ) : (
            <div className="login-buttons">
              <Button variant="outline-dark" size="sm">
                <Link to="/login/guest">
                  <h2>Guest Log In</h2>
                </Link>
              </Button>
              <Button variant="outline-dark" size="sm">
                <Link to="/login/user">
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
