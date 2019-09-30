import React, { Component } from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  Card,
  Button,
  Mask,
  IconButton
} from "gestalt";
import { Link } from "react-router-dom";
import Strapi from "strapi-sdk-javascript/build/main";
import { calculatePrice, setCart, getCart } from "./utils";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class Brews extends Component {
  state = {
    brews: [],
    brand: "",
    cartItems: []
  };
  async componentDidMount() {
    try {
      const brandId = this.props.match.params.brandId;
      const response = await strapi.request("POST", "/graphql", {
        data: {
          query: `
              query {
                  brand(id: "${brandId}"){
                   _id
                   name
                   brews{
                     _id
                     name
                     description
                     image{
                     url
                     }
                     price
                     brand{
                         _id
                     }
                   }
                 }
               }
                  `
        }
      });
      this.setState({
        brews: response.data.brand.brews,
        brand: response.data.brand.name,
        cartItems: getCart()
      });
    } catch (error) {
      console.error(error);
    }
  }

  addToCart = brew => {
    const alreadyInCart = this.state.cartItems.findIndex(
      item => item._id === brew._id
    );

    if (alreadyInCart === -1) {
      const updatedItems = this.state.cartItems.concat({
        ...brew,
        quantity: 1
      });
      this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
    } else {
      const updatedItems = [...this.state.cartItems];
      updatedItems[alreadyInCart].quantity += 1;
      this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
    }
  };

  removeItemFromCart = id => {
    const filteredItems = this.state.cartItems.filter(item => item._id !== id);
    this.setState({ cartItems: filteredItems }, () => setCart(filteredItems));
  };
  render() {
    const { brand, brews, cartItems } = this.state;
    return (
      <Box
        marginTop={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        dangerouslySetInlineStyle={{
          __style: {
            flexWrap: "wrap-reverse"
          }
        }}
      >
        {/* Brews section */}
        <Box display="flex" direction="column" alignItems="center">
          {/* Brews heading */}
          <Box margin={2}>
            <Heading color="orchid">{brand}</Heading>
          </Box>
          {/* Brews */}
          <Box
            dangerouslySetInlineStyle={{
              __style: {
                backgroundColor: "#bdcdd9"
              }
            }}
            shape="rounded"
            display="flex"
            justifyContent="center"
            padding={4}
            wrap
          >
            {brews.map(brew => (
              <Box paddingY={4} width={250} margin={2} key={brew._id}>
                <Card
                  image={
                    <Box height={200} width={200}>
                      <Image
                        fit="cover"
                        naturalWidth={1}
                        naturalHeight={1}
                        src={`${apiUrl}${brew.image.url}`}
                        alt={`${brew.image.name}`}
                      />
                    </Box>
                  }
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    direction="column"
                  >
                    <Box marginBottom={2}>
                      <Text size="xl">{brew.name}</Text>
                      <Text color="orchid">${brew.price}</Text>
                    </Box>
                    <Text>{brew.description}</Text>

                    <Box marginTop={2}>
                      <Text>
                        <Button
                          onClick={() => this.addToCart(brew)}
                          color="blue"
                          text="Add to Cart"
                        />
                      </Text>
                    </Box>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* User cart */}
        <Box alignSelf="end" marginTop={2} marginLeft={8}>
          <Mask shape="rounded" wash>
            <Box
              display="flex"
              direction="column"
              alignItems="center"
              padding={2}
            >
              {/* User cart heading */}
              <Heading align="center" size="md">
                Your Cart
              </Heading>
              <Text color="gray" italic>
                {cartItems.length} items selected
              </Text>

              {/* Cart items */}
              {cartItems.map(item => (
                <Box key={item._id} display="flex" alignItems="center">
                  <Text>
                    {item.name} x {item.quantity} -{" "}
                    {(item.quantity * item.price).toFixed(2)}
                  </Text>
                  <IconButton
                    accessibilityLabel="Delete Icon"
                    icon="cancel"
                    size="sm"
                    iconColor="red"
                    onClick={() => this.removeItemFromCart(item._id)}
                  />
                </Box>
              ))}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                direction="column"
              >
                <Box margin={2}>
                  {cartItems.length === 0 && (
                    <Text color="red">Please select wanted items</Text>
                  )}
                </Box>
                <Text size="lg">Total: {calculatePrice(cartItems)}</Text>
                <Text>
                  <Link to="/checkout">Checkout</Link>
                </Text>
              </Box>
            </Box>
          </Mask>
        </Box>
      </Box>
    );
  }
}

export default Brews;
