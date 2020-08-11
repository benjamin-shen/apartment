import React from "react";
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
// import Signup from "./components/SignUp";
import "./styles/App.css";

function PageNotFound() {
  return <Redirect to="/" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
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
            {/*<Route exact path="/signup" component={Signup} />*/}
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
