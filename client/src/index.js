import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import App from "./components/App";
import SignIn from "./components/Signin";
import Signup from "./components/Signup";
import Checkout from "./components/Checkout";
import Navbar from "./components/Navbar";
import Brews from "./components/Brews";
import { getToken } from "./components/utils";

import "gestalt/dist/gestalt.css";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      getToken() !== null ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "./signin",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const Root = () => (
  <Router>
    <>
      <Navbar />
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={Signup} />
        <PrivateRoute path="/checkout" component={Checkout} />
        <Route path="/:brandId" component={Brews} />
      </Switch>
    </>
  </Router>
);

ReactDOM.render(<Root />, document.getElementById("root"));
registerServiceWorker();
