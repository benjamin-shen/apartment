import React, { useContext, useState, useCallback } from "react";
import { Container, Button } from "react-bootstrap";
import { withRouter, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";
import app from "./base";
import Nav from "./Nav";
import Back from "./Back";
import "../styles/Login.css";

const validate = app.functions().httpsCallable("validate");

const LogIn = ({ history, guest }) => {
  const [error, setError] = useState("");
  const [login, setLogin] = useState(null);

  const { currentUser, guestUser } = useContext(AuthContext);

  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      const user = email && email.value;
      const pass = password && password.value;
      try {
        if (!user) throw Error("Missing email.");
        if (!pass) throw Error("Missing password.");
        if (login) {
          await app.auth().signInWithEmailAndPassword(user, pass);
        } else {
          const valid = (await validate(pass)).data;
          if (valid) {
            await app.auth().createUserWithEmailAndPassword(user, pass);
          } else {
            throw Error("Incorrect guest password.");
          }
        }
        history.push(guest ? "/guest" : "/user");
      } catch (err) {
        setError("Error!!!");
        setTimeout(function () {
          setError(err.message);
        }, 500);
      }
    },
    [history, guest, login]
  );

  if (currentUser) {
    return <Redirect to={guestUser ? "/guest" : "/user"} />;
  }

  return (
    <div className="login">
      <Nav>
        <Back />
      </Nav>
      <Container>
        <h1>{guest ? "Guest" : "User"} Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Your email"
            />
            {guest && (
              <small className="form-text text-muted">
                We may email you for contact tracing purposes.
              </small>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder={guest ? "Guest password" : "Your password"}
            />
          </div>
          <p className="text-danger">{error}</p>
          <Button type="submit" onClick={() => setLogin(true)}>
            Log In
          </Button>
          {guest && (
            <Button
              variant="secondary"
              type="submit"
              onClick={() => setLogin(false)}
            >
              Sign Up
            </Button>
          )}
        </form>
      </Container>{" "}
    </div>
  );
};

export default withRouter(LogIn);
