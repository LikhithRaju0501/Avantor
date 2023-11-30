import React, { Component } from "react";
import {
  CartPage,
  CheckoutPage,
  Homepage,
  LoginPage,
  PageNotFound,
  ProductPage,
  RegisterPage,
  SearchPage,
  ShippingOptions,
} from "./screens";
import { AvtrNavbar } from "./components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import { GlobalMessageProvider } from "./components/GlobalMessageService/GlobalMessageService";

const queryClient = new QueryClient();

class App extends Component {
  render() {
    return (
      <QueryClientProvider client={queryClient}>
        <Router>
          <AvtrNavbar />
          <GlobalMessageProvider>
            <Routes>
              <Route exact path="/" element={<Homepage />} />
              <Route
                exact
                path="/search/:searchTerm"
                element={<SearchPage />}
              />
              <Route exact path="/p/:productId" element={<ProductPage />} />
              <Route exact path="/register" element={<RegisterPage />} />
              <Route exact path="/login" element={<LoginPage />} />
              <Route exact path="/cart" element={<CartPage />} />
              <Route
                exact
                path="/shipping-options"
                element={<ShippingOptions />}
              />
              <Route
                exact
                path="/checkout/:checkoutStep"
                element={<CheckoutPage />}
              />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </GlobalMessageProvider>
        </Router>
      </QueryClientProvider>
    );
  }
}

export default App;
