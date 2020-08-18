import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { AuthContext } from "./Auth";
import Nav from "./Nav";
import Back from "./Back";
import "../styles/VerifyEmail.css";
import app from "./base";

const VerifyEmail = () => {
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const { currentUser, guestUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Redirect to="/" />;
  }

  if (currentUser.emailVerified) {
    return <Redirect to={guestUser ? "/guest" : "/user"} />;
  }

  const reload = () => {
    if (!currentUser.emailVerified) {
      currentUser
        .reload()
        .then(() => {
          if (currentUser.emailVerified) {
            app.auth().signOut();
          }
        })
        .catch((err) => {
          console.log(err);
          setError(err.message);
        });
    }
  };
  setInterval(() => {
    reload();
  }, 1000);

  const sendVerificationEmail = () => {
    setEmailSending(true);
    setEmailSent(false);
    currentUser
      .sendEmailVerification()
      .then(() => {
        setEmailSending(false);
        setEmailSent(true);
        setError("");
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      });
  };

  const info = currentUser.displayName || currentUser.email;

  return (
    <div className="user">
      <Helmet>
        {info && <title>{info}</title>}
        {info && <meta name="title" content={info} />}
      </Helmet>
      <Nav>
        <Back />
      </Nav>
      <Container>
        <h1>Please verify your email.</h1>
        <h2>{currentUser.email}</h2>
        <Button
          size="lg"
          variant={emailSent ? "warning" : "primary"}
          onClick={sendVerificationEmail}
          className="action-button"
        >
          Resend Verification Email
        </Button>
        {error ? (
          <p className="text-danger">Error: {error}</p>
        ) : (
          <div>
            {emailSending && (
              <p className="text-danger">Sending Verification Email...</p>
            )}
            {emailSent && (
              <p className="text-danger">Verification Email Sent</p>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default VerifyEmail;
