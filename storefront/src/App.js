import React, { Component } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Homepage, SearchPage } from "./screens";
import { AvtrNavbar } from "./components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <AvtrNavbar />
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route exact path="/search/:searchTerm" element={<SearchPage />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
