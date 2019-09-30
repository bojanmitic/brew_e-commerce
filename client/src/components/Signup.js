import React, { Component } from "react";
import { Container, Box, Button, Heading, Text, TextField } from "gestalt";
import ToastMessage from "./ToastMessage";
import Strapi from "strapi-sdk-javascript/build/main";
import { setToken } from "./utils";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class Signup extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    toast: false,
    toastMessage: "",
    loading: false
  };

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { username, email, password } = this.state;
    if (this.isFormEmpty(this.state)) {
      this.showToast("Fill in all fields");
      return;
    }

    //sign up a user
    try {
      this.setState({ loading: true });
      const response = await strapi.register(username, email, password);
      this.setState({ loading: false });
      setToken(response.jwt);
      this.redirectUser("/");
    } catch (error) {
      this.setState({ loading: false });
      this.showToast(error.message);
    }
  };

  isFormEmpty = ({ username, email, password }) => {
    return !username || !email || !password;
  };

  redirectUser = path => this.props.history.push(path);

  showToast = toastMessage => {
    this.setState({
      toast: true,
      toastMessage
    });
    setTimeout(() => this.setState({ toast: false, toastMessage: "" }), 3000);
  };
  render() {
    const { toastMessage, toast, loading } = this.state;
    return (
      <Container>
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: "#ebe2da"
            }
          }}
          margin={4}
          padding={4}
          shape="rounded"
          display="flex"
          justifyContent="center"
        >
          {/* Signup form */}
          <form
            onSubmit={this.handleSubmit}
            style={{
              display: "inlineBlock",
              textAlign: "center",
              maxWidth: 450
            }}
          >
            {/* Signup form heading */}
            <Box
              marginBottom={2}
              display="flex"
              direction="column"
              alignItems="center"
            >
              <Heading color="midnight">Let's get started</Heading>
              <Text italic color="orchid">
                Sign up to order some brews!
              </Text>
            </Box>
            {/* Username inputs */}
            <TextField
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.handleChange}
            />
            {/* Email inputs */}
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="E-mail address"
              onChange={this.handleChange}
            />
            {/* Password inputs */}
            <TextField
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChange}
            />

            <Button
              disabled={loading}
              inline
              color="blue"
              text="Submit"
              type="submit"
            />
          </form>
        </Box>
        <ToastMessage show={toast} message={toastMessage} />
      </Container>
    );
  }
}

export default Signup;
