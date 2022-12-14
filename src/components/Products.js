/* eslint-disable react-hooks/exhaustive-deps */
import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

let debounceTimeout,
  productList,
  flag = false;

const Products = () => {
  const [products, setProducts] = useState(null),
    [searchValue, setSearchValue] = useState(""),
    [loading, setLoading] = useState(true),
    [productsInCart, setProductsInCart] = useState(null);

  const isLoggedIn = localStorage.getItem("username") !== null,
    token = localStorage.getItem("token");

  const { enqueueSnackbar } = useSnackbar();

  function _handleAddToCart(id) {
    if (isLoggedIn) {
      if (productsInCart.findIndex(({ productId }) => productId === id) >= 0)
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          { variant: "warning" }
        );
      else updateCart(id, 1);
    } else
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
  }

  const updateCart = async (productId, qty) => {
    try {
      console.log("###", { productId, qty });
      const res = await axios.post(
        `${config.endpoint}/cart`,
        {
          productId,
          qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProductsInCart(res.data);
    } catch (e) {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  const fetchCart = async () => {
    try {
      let res = await axios.get(`${config.endpoint}/products`);
      productList = res.data;
      // setProducts(res.data);

      res = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProductsInCart(res.data);
    } catch (e) {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.endpoint}/products`);
      setProducts(res.data || []);
      setLoading(false);
    } catch (e) {
      enqueueSnackbar(
        "Something went wrong. Check the backend console for more details",
        { variant: "error" }
      );
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */

  const handleChange = function (e) {
    const value = e.target.value;
    setSearchValue(value);
  };

  const performSearch = async (text) => {
    if (!text) {
      performAPICall();
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `${config.endpoint}/products/search?value=${text}`,
        { validateStatus: (status) => status >= 200 && status < 500 }
      );
      setProducts(res.data || []);
      setLoading(false);
    } catch (e) {
      enqueueSnackbar(
        "Something went wrong. Check the backend console for more details",
        { variant: "error" }
      );
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (v, debounceTimeout) => {
    clearTimeout(debounceTimeout);
    return setTimeout(() => performSearch(v), 500);
  };

  useEffect(() => {
    if (flag) debounceTimeout = debounceSearch(searchValue, debounceTimeout);
    flag = true;
  }, [searchValue]);

  useEffect(() => {
    performAPICall();
    if (isLoggedIn) fetchCart();
  }, []);

  return (
    <div>
      <Header
        hasHiddenAuthButtons={true}
        setText={(v) => handleChange({ target: { value: v } })}
      >
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          value={searchValue}
          onChange={handleChange}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        value={searchValue}
        onChange={handleChange}
      />

      <Grid container>
        <Grid item xs={12} md={isLoggedIn ? 8 : 12}>
          <Grid container>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India's{" "}
                  <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
              </Box>
            </Grid>
          </Grid>

          <Grid container sx={{ p: 2 }} spacing={3} alignItems="stretch">
            {loading ? (
              <Grid item xs={12}>
                <Box
                  sx={{
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <CircularProgress color="success" />
                    <span>Loading Products...</span>
                  </Box>
                </Box>
              </Grid>
            ) : products.length > 0 ? (
              products.map((product, i) => (
                <Grid item xs={12} sm={6} lg={4} key={`${product._id}-${i}`}>
                  <ProductCard
                    product={product}
                    handleAddToCart={() => _handleAddToCart(product._id)}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box
                  sx={{
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <span>No products found</span>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Grid>
        {isLoggedIn && (
          <Grid item xs={12} md={4} sx={{ backgroundColor: "#E9F5E1" }}>
            <Cart
              productList={productList}
              items={(productsInCart || []).map((pc) => ({
                ...pc,
                ...(productList.find((pl) => pl._id === pc.productId) || {}),
              }))}
              handleQuantity={updateCart}
            />
          </Grid>
        )}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
