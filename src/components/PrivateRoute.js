import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";
import moment from "moment";
import "moment-timezone";
import app from "./base";
import User from "./User";
import Guest from "./Guest";

moment.tz.setDefault("Americas/New_York");

const log = app.firestore().collection("log");

const PrivateRoute = ({ component, guest, ...rest }) => {
  const { currentUser, guestUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Redirect to={guest ? "/login/guest" : "/login/user"} />;
  }

  if (!currentUser.emailVerified) {
    return <Redirect to={"/verifyEmail"} />;
  }

  const logLogin = (user) => {
    if (user) {
      const time = moment();
      log
        .doc(time.format("YYYY-MM"))
        .collection("login")
        .add({ user, time: new Date(time) })
        .then(() => {
          console.log("Logged login.");
        })
        .catch((err) => {
          console.log("Couldn't log login.");
          console.log(err);
        });
    }
  };

  return (
    <Route
      {...rest}
      render={(routeProps) => {
        if (guestUser) {
          if (component === "user") {
            return <Redirect to="/login/user" />;
          } else {
            logLogin(currentUser.email);
            return <Guest {...routeProps} />;
          }
        } else {
          if (component === "guest") {
            return <Redirect to="/user" />;
          } else {
            logLogin(currentUser.email);
            return <User {...routeProps} />;
          }
        }
      }}
    />
  );
};

export default PrivateRoute;
