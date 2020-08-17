import React from "react";
import { Helmet } from "react-helmet";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { AuthProvider } from "./components/Auth";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./components/Home";
import Login from "./components/LogIn";
import VerifyEmail from "./components/VerifyEmail";
import "./styles/App.css";

const appEnv = require("./env.json").app;
const appName = appEnv.name;
const appDescription = appEnv.address;

const PageNotFound = () => {
  return <Redirect to="/" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Helmet>
          <meta charSet="utf-8" />
          {appName && <title>{appName}</title>}
          {appName && <meta name="title" content={appName} />}
          {appDescription && (
            <meta name="description" content={appDescription} />
          )}
        </Helmet>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path="/user/login"
              render={(props) => <Login {...props} />}
            />
            <Route
              exact
              path="/guest/login"
              render={(props) => <Login {...props} guestPage />}
            />
            <Route exact path="/verifyEmail" component={VerifyEmail} />
            <PrivateRoute exact path="/user" />
            <PrivateRoute exact path="/guest" />
            <PrivateRoute exact path="/profile"/>
            <PrivateRoute exact path="/user/profile" />
            <PrivateRoute exact path="/guest/profile"/>
            <Route component={PageNotFound} />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
