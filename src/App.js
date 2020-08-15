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

function PageNotFound() {
  return <Redirect to="/" />;
}

function App() {
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
              path="/login/user"
              render={(props) => <Login {...props} guest={false} />}
            />
            <Route
              exact
              path="/login/guest"
              render={(props) => <Login {...props} guest={true} />}
            />
            <Route exact path="/verifyEmail" component={VerifyEmail} />
            <PrivateRoute exact path="/user" component="user" guest={false} />
            <PrivateRoute exact path="/guest" component="guest" guest={true} />
            <Route component={PageNotFound} />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
