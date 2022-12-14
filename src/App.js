import React from 'react';
import Products from "./components/Products";
import Login from "./components/Login";
import Register from "./components/Register";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ipConfig from "./ipConfig.json";
// import ProductCard from './components/ProductCard';
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8083/api/v1`,
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          {/* Private Route  */}

          {/* Public Routes */}
          <Route path="/thanks">
          <Thanks />
        </Route>
          <Route path="/checkout">
          <Checkout />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/">
          <Products />
        </Route>

        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
