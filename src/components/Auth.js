import React, { createContext, useState, useEffect } from "react";
import app from "./base";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState();

  const [uids, setUids] = useState(new Set());
  const [authorizing, setAuthorizing] = useState(false);
  const [shouldGetUids, setShouldGetUids] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [guestUser, setGuestUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    if (shouldGetUids) {
      const getUids = async () => {
        setError("");
        setAuthorizing(true);
        await app
          .functions()
          .httpsCallable("getUids")()
          .then(({ data: uids }) => {
            uids && setUids(new Set(uids));
            setAuthorizing(false);
          })
          .catch((err) => {
            console.log(err);
            setError(err);
          });
      };
      getUids();
    }
  }, [shouldGetUids]);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        setShouldGetUids(true);
      }
      setCurrentUser(user);
      setGuestUser(user && !uids.has(user.uid));
      setPending(false);
    });
  }, [uids]);

  if (error) {
    return <p className="message">There was an error.</p>;
  }
  if (pending) {
    return <p className="message">Loading...</p>;
  }
  if (authorizing) {
    return <p className="message">Authorizing...</p>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, guestUser }}>
      {children}
    </AuthContext.Provider>
  );
};
