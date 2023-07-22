import React, { Component } from "react";
import { Homepage, ProductPage, SearchPage } from "./screens";
import { AvtrNavbar } from "./components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";

const queryClient = new QueryClient();

class App extends Component {
  render() {
    return (
      <QueryClientProvider client={queryClient}>
        <Router>
          <AvtrNavbar />
          <Routes>
            <Route exact path="/" element={<Homepage />} />
            <Route exact path="/search/:searchTerm" element={<SearchPage />} />
            <Route exact path="/p/:productId" element={<ProductPage />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    );
  }
}

export default App;
