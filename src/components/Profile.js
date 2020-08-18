import React, { useContext, useState, useEffect, useRef } from "react";
import { Container, Button } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { AuthContext } from "./Auth";
import app from "./base";
import Nav from "./Nav";
import Back from "./Back";
import SignOut from "./SignOut";
import "../styles/Profile.css";

const NameInput = ({ changeName, setNameChange }) => {
  const [nameInput, setNameInput] = useState("");

  const handleChange = (event) => {
    setNameInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    changeName(nameInput);
    setNameChange(false);
  };

  return (
    <form
      className="form-inline justify-content-center"
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="name-input">
        New Name
      </label>
      <input
        type="text"
        className="form-control mb-2 mr-sm-2 center"
        id="name-input"
        placeholder="New Name"
        onChange={handleChange}
      />
      <button type="submit" className="btn btn-primary mb-2">
        Update
      </button>
    </form>
  );
};

const Profile = () => {
  const { currentUser, guestUser } = useContext(AuthContext);
  const { email, displayName } = currentUser;
  const info = displayName || email;

  const [name, setName] = useState(currentUser.displayName);
  const [nameChange, setNameChange] = useState(false);
  const [sentPasswordReset, setSentPasswordReset] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [nameMessage, setNameMessage] = useState("");

  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const changePassword = () => {
    setPasswordMessage("Sending password reset email...");
    email &&
      app
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          setSentPasswordReset(true);
          setPasswordMessage("Password reset email sent.");
        })
        .catch((err) => {
          setPasswordMessage("Error!");
          setTimeout(() => {
            if (!mountedRef.current) return null;
            setPasswordMessage(err.message);
          }, 500);
        });
  };
  const changeName = (newName) => {
    setNameMessage(`Changing name to ${newName}...`);
    currentUser
      .updateProfile({ displayName: newName })
      .then(() => {
        setName(newName);
        currentUser.reload();
        setNameMessage("");
      })
      .catch((err) => {
        setNameMessage("Error!");
        setTimeout(() => {
          if (!mountedRef.current) return null;
          setNameMessage(err.message);
        }, 500);
      });
  };

  return (
    <div className="profile">
      <Helmet>
        {info && <title>{info}</title>}
        {info && <meta name="title" content={info} />}
      </Helmet>
      <Nav>
        <Back link={guestUser ? "/guest" : "/user"} />
        <SignOut />
      </Nav>
      <Container>
        <h1>{guestUser ? "Guest" : "User"} Profile</h1>
        {email && <h2>Email: {email}</h2>}
        {name && <h2>Name: {name}</h2>}
        {nameChange && (
          <NameInput changeName={changeName} setNameChange={setNameChange} />
        )}
        <Button
          size="lg"
          variant="danger"
          className="action-button"
          onClick={changePassword}
          disabled={sentPasswordReset}
        >
          Change Password
        </Button>
        <Button
          size="lg"
          variant={name ? "warning" : "primary"}
          className="action-button"
          onClick={() => {
            setNameChange(true);
          }}
          disabled={nameChange}
        >
          {name ? "Change" : "Set"} Name
        </Button>
        {passwordMessage && <p className="text-danger">{passwordMessage}</p>}
        {nameMessage && <p className="text-danger">{nameMessage}</p>}
      </Container>
    </div>
  );
};

export default Profile;
