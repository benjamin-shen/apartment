import React, { createContext, useEffect, useState } from "react";
import app from "./base";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [uids, setUids] = useState(new Set());
  const [authorizing, setAuthorizing] = useState(true);

  const [currentUser, setCurrentUser] = useState(null);
  const [guestUser, setGuestUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    const getUids = async () => {
      setAuthorizing(true);
      await app
        .functions()
        .httpsCallable("getUids")()
        .then(({ data: uids }) => {
          uids && setUids(new Set(uids));
          setAuthorizing(false);
        });
    };
    getUids();
  }, []);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setGuestUser(user && !uids.has(user.uid));
      setPending(false);
    });
  }, [uids]);

  if (pending) {
    return <p className="loading">Loading...</p>;
  }
  if (authorizing) {
    return <p className="loading">Authorizing...</p>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, guestUser }}>
      {children}
    </AuthContext.Provider>
  );
};
