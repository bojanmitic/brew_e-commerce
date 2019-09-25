import React from "react";
import { Box, Text, Heading, Image } from "gestalt";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
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
            <Image src="./icons/logo.svg" alt="brew haha logo" />
          </Box>
          <Heading size="xs" color="orange">
            BrewHaha
          </Heading>
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
};

export default Navbar;
