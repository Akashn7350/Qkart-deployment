import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState, useEffect } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { Redirect,useHistory, Link } from "react-router-dom";
// import {  } from "react-router";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loader, setLoader] = useState(false);
  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function

  // const Register = () => {
  //   const { enqueueSnackbar } = useSnackbar();

  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    setLoader(true);
    // console.log("formData", formData, validateInput(formData));
    if (validateInput(formData)) {
      const url = config.endpoint + "/auth/register";
      console.log(loader);
      try {
        await axios
          .post(url, {
            username: formData.username,
            password: formData.password,
          })
          .then((resp) => {
            setLoader(false);
            enqueueSnackbar("Registered success ");
            console.log(resp);
          })
          .catch((err) => {
            setLoader(false);

            // if (err.inclue("400")){
            enqueueSnackbar("Username is already taken");
            // }console.log(err);
          });
      } catch (e) {
        setLoader(false);

        enqueueSnackbar("Username is already taken");
      }
    } else {
      setLoader(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    if (data.username === "") {
      enqueueSnackbar("Username is a required field");
    } else if (data.username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters");
    }
    if (data.password === "") {
      enqueueSnackbar("Password is a required field");
    } else if (data.password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters");
    } else if (data.password !== data.confirmPassword) {
      enqueueSnackbar("Passwords do not match");
    }
    if (
      data.username !== "" &&
      data.username.length >= 6 &&
      data.password !== "" &&
      data.password.length >= 6 &&
      data.password === data.confirmPassword
    ) {
      return true;
    }
    return false;
  };
  const [hasHiddenAuthButtons, setHasHiddenAuthButtons] = useState(false);
useEffect(()=>{
  setHasHiddenAuthButtons(false)
})
// if (window.location.href[window.location.href.length-1] === ("/")){
//   setHasHiddenAuthButtons(true)
// }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const uName = (e) => setUsername(e.target.value);
  const pass = (e) => setPassword(e.target.value);
  const cPass = (e) => setConfirmPassword(e.target.value);
  const formData = {
    username,
    password,
    confirmPassword,
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
      className="align-left"
    >
      <Header hasHiddenAuthButtons={hasHiddenAuthButtons} />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            value={username}
            onChange={uName}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            value={password}
            onChange={pass}
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={cPass}
            fullWidth
          />
          {!loader ? (
            <Button
              className="button"
              variant="contained"
              onClick={() => register(formData)}
            >
              register now
            </Button>
          ) : (
            <>
              <Redirect to="/login" />
              <CircularProgress />
            </>
          )}
          <p className="secondary-action">
            already have an account?{" "}
            <Link className="link" to="/login" >
              login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
