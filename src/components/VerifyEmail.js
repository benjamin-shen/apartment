import React, { useContext, useState } from "react";
import { withRouter, Redirect, useLocation } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { AuthContext } from "./Auth";
import Nav from "./Nav";
import Back from "./Back";
import "../styles/VerifyEmail.css";

const VerifyEmail = ({ history }) => {
  const location = useLocation();

  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState();

  const { currentUser } = useContext(AuthContext);

  if (!currentUser || (currentUser.reload() && currentUser.emailVerified)) {
    return <Redirect to="/user" />;
  }

  const reload = () => {
    currentUser
      .reload()
      .then(() => {
        if (currentUser.emailVerified) history.push(location.pathname);
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      });
  };

  const sendVerificationEmail = () => {
    setEmailSending(true);
    setEmailSent(false);
    currentUser
      .sendEmailVerification()
      .then(() => {
        setEmailSending(false);
        setEmailSent(true);
        setError();
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
        <meta charSet="utf-8" />
        {info && <title>{info}</title>}
        {info && <meta name="title" content={info} />}
      </Helmet>
      <Nav>
        <Back />
      </Nav>
      <Container>
        <h1>Please verify your email and reload the page.</h1>
        <p>{currentUser.email}</p>
        <Button
          size="lg"
          variant={emailSent ? "warning" : "primary"}
          onClick={sendVerificationEmail}
          className="action-button"
        >
          Resend Verification Email
        </Button>
        <Button
          size="lg"
          variant="success"
          onClick={reload}
          className="action-button"
        >
          I have verified!
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

export default withRouter(VerifyEmail);
