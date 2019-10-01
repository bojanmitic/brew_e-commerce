import React, { Component } from "react";
import { Box, Text, Heading, Image, Button } from "gestalt";
import { NavLink, withRouter } from "react-router-dom";
import { getToken, clearCart, clearToken } from "./utils";

class Navbar extends Component {
  handleSignOut = () => {
    clearCart();
    clearToken();
    this.props.history.push("/");
  };
  render() {
    return getToken() !== null ? (
      <AuthNav handleSignOut={this.handleSignOut} />
    ) : (
      <UnAuthNav />
    );
  }
}

const AuthNav = ({ handleSignOut }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="around"
    height={70}
    color="midnight"
    padding={1}
    shape="roundedBottom"
  >
    {/* Checkout link */}
    <NavLink activeClassName="active" to="/checkout">
      <Text size="xl" color="white">
        {" "}
        Checkout
      </Text>
    </NavLink>

    {/* TItle and logo */}
    <NavLink exact activeClassName="active" to="/">
      <Box display="flex" alignItems="center">
        <Box margin={2} height={50} width={50}>
          <Image
            naturalHeight={1}
            naturalWidth={1}
            src="./icons/logo.svg"
            alt="brew haha logo"
          />
        </Box>
        <div className="main-title">
          <Heading size="xs" color="orange">
            BrewHaha
          </Heading>
        </div>
      </Box>
    </NavLink>

    {/* Sign out button  */}
    <Button
      onClick={handleSignOut}
      color="transparent"
      text="Sign Out"
      inline
      size="md"
    />
  </Box>
);

const UnAuthNav = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="around"
    height={70}
    color="midnight"
    padding={1}
    shape="roundedBottom"
  >
    {/* Sign In link */}
    <NavLink activeClassName="active" to="/signin">
      <Text size="xl" color="white">
        {" "}
        Sign In
      </Text>
    </NavLink>

    {/* TItle and logo */}
    <NavLink exact activeClassName="active" to="/">
      <Box display="flex" alignItems="center">
        <Box margin={2} height={50} width={50}>
          <Image
            naturalHeight={1}
            naturalWidth={1}
            src="./icons/logo.svg"
            alt="brew haha logo"
          />
        </Box>
        <div className="main-title">
          <Heading size="xs" color="orange">
            BrewHaha
          </Heading>
        </div>
      </Box>
    </NavLink>

    {/* Sign up link */}
    <NavLink activeClassName="active" to="/signup">
      <Text size="xl" color="white">
        {" "}
        Sign Up
      </Text>
    </NavLink>
  </Box>
);

export default withRouter(Navbar);
