import React, { Component } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Homepage, SearchPage } from "./screens";
import { AvtrNavbar } from "./components";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/search",
    element: <SearchPage />,
  },
]);

class App extends Component {
  render() {
    return (
      <div>
        <AvtrNavbar />
        <RouterProvider router={router} />
      </div>
    );
  }
}

export default App;
