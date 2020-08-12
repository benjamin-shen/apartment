import React, { useEffect, useState } from "react";
import app from "./base";

const users = new Set([
  "7lwir23rS2cPEtUgEbJ3XHJ7qGJ3",
  "DvOJKEOnd7PC1JEs9pJYQnbT3ee2",
  "ebU4uaxXw4biF9hSW7weQP77urz1",
]);

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
