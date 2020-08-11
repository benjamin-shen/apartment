import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";
import User from "./User";
import Guest from "./Guest";

const PrivateRoute = ({ component, guest, ...rest }) => {
  const { currentUser, guestUser } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        !!currentUser ? (
          guestUser ? (
            component === "user" ? (
              <Redirect to="/login/user" />
            ) : (
              <Guest {...routeProps} />
            )
          ) : component === "guest" ? (
            <Redirect to="/user" />
          ) : (
            <User {...routeProps} />
          )
        ) : (
          <Redirect to={guest ? "/login/guest" : "/login/user"} />
        )
      }
    />
  );
};

export default PrivateRoute;
