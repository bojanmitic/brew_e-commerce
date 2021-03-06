import React, { Component } from "react";
import { Container, Box, Heading, TextField, Text } from "gestalt";
import ToastMessage from "./ToastMessage";
import {
  getCart,
  calculatePrice,
  clearCart,
  calculateAmount
} from "./utils/index";
import ConfirmationModal from "./ConfirmationModal";
import {
  Elements,
  StripeProvider,
  CardElement,
  injectStripe
} from "react-stripe-elements";
import Strapi from "strapi-sdk-javascript/build/main";
import { withRouter } from "react-router-dom";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class _CheckoutForm extends Component {
  state = {
    address: "",
    postalCode: "",
    city: "",
    confirmationEmailAddress: "",
    toast: false,
    toastMessage: "",
    cartItems: [],
    orderProcessing: false,
    modal: false
  };

  componentDidMount() {
    this.setState({ cartItems: getCart() });
  }

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  handleConfirmOrder = async event => {
    event.preventDefault();

    if (this.isFormEmpty(this.state)) {
      this.showToast("Fill in all fields");
      return;
    }
    this.setState({ modal: true });
  };

  handleSubmitOrder = async () => {
    const {
      cartItems,
      city,
      address,
      postalCode,
      confirmationEmailAddress
    } = this.state;
    const amount = calculateAmount(cartItems);
    //Process order
    this.setState({ orderProcessing: true });
    let token;
    try {
      const response = await this.props.stripe.createToken();
      token = response.token.id;
      await strapi.createEntry("orders", {
        amount,
        brews: cartItems,
        city,
        postalCode,
        address,
        token
      });

      await strapi.request("POST", "/email", {
        data: {
          to: confirmationEmailAddress,
          subject: `Order Confirmation - BrewHaha ${new Date(Date.now())}`,
          text: "Your order has been processed",
          html: "<bold>Expect your order to arrive in 2-3 shipping days</bold>"
        }
      });

      this.setState({ orderProcessing: false, modal: false });
      clearCart();
      this.showToast("Your order has been successfully submitted!", true);
    } catch (error) {
      this.setState({ orderProcessing: false, modal: false });
      this.showToast(error.message);
    }
  };

  closeModal = () => this.setState({ modal: false });

  isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {
    return !address || !postalCode || !city || !confirmationEmailAddress;
  };

  redirectUser = path => this.props.history.push(path);

  showToast = (toastMessage, redirect = false) => {
    this.setState(
      {
        toast: true,
        toastMessage
      },
      //if true is passed as a second arg in showToast
      //redirect to home route
      () => redirect && this.props.history.push("/")
    );
    setTimeout(() => this.setState({ toast: false, toastMessage: "" }), 3000);
  };
  render() {
    const {
      toast,
      toastMessage,
      cartItems,
      modal,
      orderProcessing
    } = this.state;
    return (
      <Container>
        <Box
          color="darkWash"
          margin={4}
          padding={4}
          shape="rounded"
          display="flex"
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          {/* Checkout form heading */}
          <Heading color="midnight">Checkout</Heading>
          {cartItems.length > 0 ? (
            <>
              {/* User cart */}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                direction="column"
                marginTop={2}
                marginBottom={6}
              >
                <Text color="darkGray" italic>
                  {cartItems.length} for Checkout
                </Text>
                <Box padding={2}>
                  {cartItems.map(item => (
                    <Box key={item._id} padding={1}>
                      <Text color="midnight">
                        {item.name} x {item.quantity} - $
                        {item.quantity * item.price}
                      </Text>
                    </Box>
                  ))}
                  <Text bold>Total Amount: {calculatePrice(cartItems)}</Text>
                </Box>
              </Box>

              {/* Checkout form form */}
              <form
                onSubmit={this.handleConfirmOrder}
                style={{
                  display: "inlineBlock",
                  textAlign: "center",
                  maxWidth: 450
                }}
              >
                {/* Shipping address inputs */}
                <TextField
                  id="address"
                  type="text"
                  name="address"
                  placeholder="Shipping address"
                  onChange={this.handleChange}
                />
                {/* Postal code inputs */}
                <TextField
                  id="postalCode"
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  onChange={this.handleChange}
                />
                {/* Coty inputs */}
                <TextField
                  id="city"
                  type="text"
                  name="city"
                  placeholder="City"
                  onChange={this.handleChange}
                />
                {/* Confirmation email address input */}
                <TextField
                  id="confirmationEmailAddress"
                  type="email"
                  name="confirmationEmailAddress"
                  placeholder="Confirmation Email Address"
                  onChange={this.handleChange}
                />
                {/* Credit card element */}
                <CardElement
                  id="stripe__input"
                  onReady={input => input.focus()}
                />

                <button id="stripe__button" type="submit">
                  Submit
                </button>
              </form>
            </>
          ) : (
            // Default text if no items in the cart
            <Box color="darkWash" shape="rounded" padding={4}>
              <Heading align="center" color="watermelon" size="xs">
                Your cart is empty
              </Heading>
              <Text align="center" italic color="green">
                Add some brews
              </Text>
            </Box>
          )}
        </Box>
        {/* Confirmation modal */}
        {modal && (
          <ConfirmationModal
            orderProcessing={orderProcessing}
            cartItems={cartItems}
            closeModal={this.closeModal}
            handleSubmitOrder={this.handleSubmitOrder}
          />
        )}
        <ToastMessage show={toast} message={toastMessage} />
      </Container>
    );
  }
}

const CheckoutForm = withRouter(injectStripe(_CheckoutForm));

const Checkout = () => (
  <StripeProvider apiKey="pk_test_NMUTITlDdGAt3upRsFs3gRXh00KfShmAtB">
    <Elements>
      <CheckoutForm />
    </Elements>
  </StripeProvider>
);

export default Checkout;
