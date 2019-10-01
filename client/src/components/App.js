import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Heading,
  Box,
  Card,
  Image,
  Text,
  SearchField,
  Icon
} from "gestalt";
import "./App.css";
import Loader from "./Loader";

import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class App extends Component {
  state = {
    brands: [],
    searchTerm: "",
    loadingBrands: true
  };
  async componentDidMount() {
    try {
      const response = await strapi.request("POST", "/graphql", {
        data: {
          query: `query{
            brands{
              _id
              name
              description
              image{
                url
              }
            }
          }`
        }
      });
      this.setState({ brands: response.data.brands, loadingBrands: false });
    } catch (error) {
      this.setState({ loadingBrands: false });
      console.error(error);
    }
  }

  handleChange = ({ value }) => {
    this.setState({ searchTerm: value }, () => this.searchBrands());
  };

  // filteredBrands = ({ searchTerm, brands }) => {
  //   return brands.filter(
  //     brand =>
  //       brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       brand.description.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // };

  searchBrands = async () => {
    const response = await strapi.request("POST", "/graphql", {
      data: {
        query: `query {
          brands(where: {
           name_contains: "${this.state.searchTerm}"
         }){
          _id
          name
          description
          image{
            url
          }
         }
       }
        `
      }
    });
    this.setState({
      brands: response.data.brands,
      loadingBrands: false
    });
  };
  render() {
    const { searchTerm, loadingBrands, brands } = this.state;
    return (
      <Container>
        <Box display="flex" justifyContent="center" marginTop={4}>
          <SearchField
            id="searchField"
            accessibilityLabel="Brands search field"
            onChange={this.handleChange}
            placeholder="Search Brands"
            value={searchTerm}
          />
          <Box margin={2}>
            <Icon
              icon="filter"
              color={searchTerm ? "orange" : "gray"}
              size={20}
              accessibilityLabel="filter"
            />
          </Box>
        </Box>
        {/* Brands section */}
        <Box display="flex" justifyContent="center" marginBottom={2}>
          {/* Brands header */}
          <Heading color="midnight" size="md">
            Brew Brands
          </Heading>
        </Box>
        {/* Brands */}
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: "#d6c8ec"
            }
          }}
          wrap
          display="flex"
          justifyContent="around"
        >
          {brands.map(brand => (
            <Box paddingY={4} width={200} margin={2} key={brand._id}>
              <Card
                image={
                  <Box height={200} width={200}>
                    <Image
                      fit="cover"
                      naturalWidth={1}
                      naturalHeight={1}
                      src={`${apiUrl}${brand.image.url}`}
                      alt={`${brand.image.name}`}
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
                  <Text size="xl">{brand.name}</Text>
                  <Text>{brand.description}</Text>
                  <Text>
                    <Link to={`/${brand._id}`}>See Brews</Link>
                  </Text>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
        <Loader show={loadingBrands} />
      </Container>
    );
  }
}

export default App;
