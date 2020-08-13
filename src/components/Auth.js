import React, { useEffect, useState } from "react";
import app from "./base";

const uids = require("../env.json").app.uids;

const users = new Set(uids);

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [guestUser, setGuestUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setGuestUser(user && !users.has(user.uid));
      setPending(false);
    });
  }, []);

  if (pending) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, guestUser }}>
      {children}
    </AuthContext.Provider>
  );
};
