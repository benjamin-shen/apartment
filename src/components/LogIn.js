import React, { useCallback, useState, useContext } from "react";
import { Container } from "react-bootstrap";
import { withRouter, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";
import app from "./base";
import Back from "./Back";

const LogIn = ({ history, guest }) => {
  const [error, setError] = useState("");

  const handleLogIn = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        if (!guest && !email.value) throw Error("Missing email.");
        if (!password.value) throw Error("Missing password.");
        const username = guest
          ? "benjaminshen22+401bguest@gmail.com"
          : email.value;
        await app.auth().signInWithEmailAndPassword(username, password.value);
        history.push(guest ? "/guest" : "/user");
      } catch (err) {
        setError("Error!!!");
        setTimeout(function () {
          setError(err.message);
        }, 500);
      }
    },
    [history, guest]
  );

  const { currentUser, guestUser } = useContext(AuthContext);
  if (currentUser) {
    return <Redirect to={guestUser ? "/guest" : "/user"} />;
  }

  return (
    <div className="login">
      <Back />
      <Container>
        <form onSubmit={handleLogIn}>
          {guest || (
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="Your email"
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder={guest ? "Guest password" : "Your password"}
            />
            {guest && (
              <small className="form-text text-muted">
                Please ask a resident if you don't know the password.
              </small>
            )}
          </div>
          <p className="text-danger">{error}</p>
          <button type="submit" className="btn btn-primary">
            Log In
          </button>
        </form>
      </Container>{" "}
    </div>
  );
};

export default withRouter(LogIn);
