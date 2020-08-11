import React, { useCallback, useState } from "react";
import { Container } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import app from "./base";
import Back from "./Back";

const SignUp = ({ history }) => {
  const [error, setError] = useState("");

  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password, confirm } = event.target.elements;
      try {
        if (!email.value) throw Error("Missing email.");
        if (!password.value) throw Error("Missing password.");
        if (!confirm.value) throw Error("Missing password confirmation.");
        if (password.value !== confirm.value)
          throw Error("Passwords do not match.");
        await app
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value);
        history.push("/guest");
      } catch (err) {
        setError("Error!!!");
        setTimeout(function () {
          setError(err.message);
        }, 500);
      }
    },
    [history]
  );

  return (
    <div>
      <Back />
      <Container>
        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label for="email">Email Address</label>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Your email"
            />
            <small className="form-text text-muted">
              We may email you for contact tracing purposes.
            </small>
          </div>
          <div className="form-group">
            <label for="password">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Your password"
            />
          </div>
          <div className="form-group">
            <label for="confirm">Confirm Password</label>
            <input
              name="confirm"
              type="password"
              className="form-control"
              placeholder="Confirm password"
            />
          </div>
          <p className="text-danger">{error}</p>
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </form>
      </Container>
    </div>
  );
};

export default withRouter(SignUp);
