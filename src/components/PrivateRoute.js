import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { useLocalStorage, writeStorage } from "@rehooks/local-storage";
import moment from "moment";
import "moment-timezone";
import app from "./base";
import { AuthContext } from "./Auth";
import User from "./User";
import Guest from "./Guest";
import Profile from "./Profile";

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

const PrivateRoute = ({ path, ...rest }) => {
  const guestPage = path.includes("/guest");

  const { currentUser, guestUser } = useContext(AuthContext);
  const info = currentUser && currentUser.email && ":" + currentUser.email;

  const [lastInvoked] = useLocalStorage(lastInvokedKey + info);
  const writeLocalStorage = (time) =>
    writeStorage(lastInvokedKey + info, time.format());

  if (!currentUser) {
    return <Redirect to={(guestPage ? "/guest" : "/user") + "/login"} />;
  }

  if (!currentUser.emailVerified) {
    return <Redirect to="/verifyEmail" />;
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
          writeLocalStorage(time);

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
        writeLocalStorage(time);
      }
    }
  };

  return (
    <Route
      {...rest}
      render={(routeProps) => {
        if (guestUser) {
          switch (path) {
            case "/user":
              return <Redirect to="/guest" />;
            case "/user/profile":
              return <Redirect to="/guest/profile" />;
            case "/guest":
              logLogin(currentUser.email);
              return <Guest {...routeProps} />;
            case "/guest/profile":
              return <Profile {...routeProps} />;
            case "/profile":
              return <Redirect to="/guest/profile" />;
            default:
              return <Redirect to="/guest" />;
          }
        } else {
          switch (path) {
            case "/guest":
              return <Guest {...routeProps} />;
            case "/user":
              logLogin(currentUser.email);
              return <User {...routeProps} />;
            case "/guest/profile":
            case "/profile":
              return <Redirect to="/user/profile" />;
            case "/user/profile":
              return <Profile {...routeProps} />;
            default:
              return <Redirect to="/user" />;
          }
        }
      }}
    />
  );
};

export default PrivateRoute;
