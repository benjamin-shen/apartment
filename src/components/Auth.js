import React, { useEffect, useState } from "react";
import app from "./base";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [guestUser, setGuestUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setGuestUser(user && user.uid === "4kxqYOpFircVGYKMKWiSNIaPCk73");
      setPending(false);
    });
  }, []);

  if (pending) {
    return <p>Loading...</p>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, guestUser }}>
      {children}
    </AuthContext.Provider>
  );
};
