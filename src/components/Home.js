import React, { useContext } from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "./Auth";
import Doorbell from "./Doorbell";
import SignOut from "./SignOut";
import "../styles/Home.css";

function Home() {
  const { currentUser, guestUser } = useContext(AuthContext);
  // currentUser.updateProfile({displayName: "a user"})

  return (
    <div className="home">
      <Container>
        <h1>Welcome to 401 Eddy St Apt B</h1>
        <main>
          <div className="doorbell-button">
            <Doorbell />
          </div>

          {currentUser &&
            (guestUser ? (
              <h3>
                You are signed in as{" "}
                <Link to="/guest" className="text-info">
                  {currentUser.displayName || currentUser.email || "a guest"}
                </Link>
                .
              </h3>
            ) : (
              <h3>
                You are signed in as{" "}
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
                <Link to="/login/guest">
                  <h2>Guest Log In</h2>
                </Link>
              </Button>
              <Button variant="outline-dark" size="sm" className="login-button">
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
