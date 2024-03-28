import React, { Component } from "react";
import {
  CartPage,
  CmsAdminPage,
  Homepage,
  InvoicePage,
  LoginPage,
  OrdersPage,
  PageNotFound,
  ProductPage,
  RegisterPage,
  SearchPage,
  ShippingOptions,
} from "./screens";
import { AvtrNavbar, CmsComponent } from "./components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import { GlobalMessageProvider } from "./components/GlobalMessageService/GlobalMessageService";
import { isLoggedIn } from "./api/register";
import CheckoutStepsGuard from "./screens/CheckoutPage/CheckoutStepsGuard";
import "./App.css";
import ResetPassword from "./screens/ResetPasswordPage";

const queryClient = new QueryClient();

class App extends Component {
  render() {
    return (
      <QueryClientProvider client={queryClient}>
        <Router>
          <AvtrNavbar />
          <GlobalMessageProvider>
            <Routes>
              <Route
                exact
                path="/"
                element={
                  <CmsComponent>
                    <Homepage />
                  </CmsComponent>
                }
              />
              <Route
                exact
                path="/search/:searchTerm"
                element={
                  <CmsComponent>
                    <SearchPage />
                  </CmsComponent>
                }
              />
              <Route
                exact
                path="/p/:productId"
                element={
                  <CmsComponent>
                    <ProductPage />
                  </CmsComponent>
                }
              />
              <Route exact path="/register" element={<RegisterPage />} />
              <Route exact path="/login" element={<LoginPage />} />
              <Route
                exact
                path="/cart"
                element={
                  isLoggedIn() ? (
                    <CmsComponent>
                      <CartPage />
                    </CmsComponent>
                  ) : (
                    <LoginPage />
                  )
                }
              />
              <Route
                exact
                path="/shipping-options"
                element={
                  isLoggedIn() ? (
                    <CmsComponent>
                      <ShippingOptions />{" "}
                    </CmsComponent>
                  ) : (
                    <LoginPage />
                  )
                }
              />
              <Route
                exact
                path="/checkout/:checkoutStep/*"
                element={
                  isLoggedIn() ? (
                    <CmsComponent>
                      <CheckoutStepsGuard />
                    </CmsComponent>
                  ) : (
                    <LoginPage />
                  )
                }
              />

              <Route
                exact
                path="/orders"
                element={
                  isLoggedIn() ? (
                    <CmsComponent>
                      <OrdersPage />
                    </CmsComponent>
                  ) : (
                    <LoginPage />
                  )
                }
              />

              <Route
                exact
                path="/invoices"
                element={
                  isLoggedIn() ? (
                    <CmsComponent>
                      <InvoicePage />{" "}
                    </CmsComponent>
                  ) : (
                    <LoginPage />
                  )
                }
              />

              <Route
                exact
                path="/cms-admin"
                element={
                  isLoggedIn() ? (
                    <CmsComponent>
                      <CmsAdminPage />{" "}
                    </CmsComponent>
                  ) : (
                    <LoginPage />
                  )
                }
              />

              <Route
                exact
                path="/reset-password"
                element={
                  !isLoggedIn() ? (
                    <CmsComponent>
                      <ResetPassword />
                    </CmsComponent>
                  ) : (
                    <PageNotFound />
                  )
                }
              />

              <Route path="*" element={<CmsComponent />} />
            </Routes>
          </GlobalMessageProvider>
        </Router>
      </QueryClientProvider>
    );
  }
}

export default App;
