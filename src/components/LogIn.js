import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Container, Button } from "react-bootstrap";
import { useHistory, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";
import app from "./base";
import Nav from "./Nav";
import Back from "./Back";
import "../styles/Login.css";

const validate = app.functions().httpsCallable("validate");

const LogIn = ({ guestPage }) => {
  const history = useHistory();

  const [error, setError] = useState("");
  const [signup, setSignup] = useState();

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const { currentUser, guestUser } = useContext(AuthContext);

  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      const user = email && email.value;
      const pass = password && password.value;
      setError("");
      try {
        if (!user) throw Error("Missing email.");
        if (!pass) throw Error("Missing password.");
        if (!signup) {
          await app.auth().signInWithEmailAndPassword(user, pass);
        } else {
          const valid = (await validate(pass)).data;
          if (valid) {
            await app.auth().createUserWithEmailAndPassword(user, pass);
            app
              .auth()
              .onAuthStateChanged((user) => {
                user.sendEmailVerification();
                console.log("Sent initial verification email.");
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            throw Error("Incorrect guest password.");
          }
        }
        history.push(guestPage ? "/guest" : "/user");
      } catch (err) {
        setError("Error!");
        setTimeout(() => {
          if (!mountedRef.current) return null;
          setError(err.message);
        }, 500);
      }
    },
    [history, guestPage, signup]
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
        <h1>{guestPage ? "Guest" : "User"} Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Your email"
            />
            {guestPage && (
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
              placeholder={(guestPage ? "Guest" : "Your") + " password"}
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          <Button
            type="submit"
            className="login-button"
            onClick={() => {
              setSignup(false);
            }}
          >
            Log In
          </Button>
          {guestPage && (
            <Button
              variant="secondary"
              type="submit"
              className="login-button"
              onClick={() => {
                setSignup(true);
              }}
            >
              Sign Up
            </Button>
          )}
        </form>
      </Container>
    </div>
  );
};

export default LogIn;
