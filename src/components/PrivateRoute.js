import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { useLocalStorage, writeStorage } from "@rehooks/local-storage";
import moment from "moment";
import "moment-timezone";
import app from "./base";
import { AuthContext } from "./Auth";
import User from "./User";
import Guest from "./Guest";

moment.tz.setDefault("Americas/New_York");
const isValidDate = (str) => {
  var d = moment(str);
  if (d == null || !d.isValid()) return false;
  return str.indexOf(d.format() >= 0);
};

const appName = require("../env.json").app.name;
const lastInvokedKey = `${appName}-lastInvokedLogin`;
const lastInvokedThrottle = 3600000;

const log = app.firestore().collection("log");

const PrivateRoute = ({ component, guest, ...rest }) => {
  const { currentUser, guestUser } = useContext(AuthContext);

  const [lastInvoked] = useLocalStorage(lastInvokedKey);

  if (!currentUser) {
    return <Redirect to={guest ? "/login/guest" : "/login/user"} />;
  }

  if (!currentUser.emailVerified) {
    return <Redirect to={"/verifyEmail"} />;
  }

  const logLogin = (user) => {
    if (user) {
      const time = moment();

      try {
        if (
          !lastInvoked ||
          !isValidDate(lastInvoked) ||
          time.diff(moment(lastInvoked)) >= lastInvokedThrottle
        ) {
          writeStorage(lastInvokedKey, time.format());

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
      } catch (err) {
        console.log("Local storage error.");
        console.log(err);
        writeStorage(lastInvokedKey, time.format());
      }
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
