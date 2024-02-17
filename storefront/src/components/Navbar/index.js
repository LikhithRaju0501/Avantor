import React from "react";
import {
  NavDropdown,
  Navbar,
  Nav,
  Form,
  Container,
  Button,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../../api/register";
import { useGetProductSuggestions } from "../../api/products";
import "./index.css";

const AvtrNavbar = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const loggedIn = isLoggedIn();

  let navigate = useNavigate();
  const onSubmit = (data) => {
    navigate(`/search/${data?.search}`);
    reset();
    mutate("");
  };

  const {
    delayedMutate,
    mutate,
    data: suggestionList,
  } = useGetProductSuggestions();

  const handleInputChange = (event) => {
    const inputValue = event?.target?.value;
    delayedMutate(inputValue);
  };

  const clearInput = () => {
    reset();
    mutate("");
  };

  const onMoreClick = () => {
    const searchTerm = watch("search");
    navigate(`/search/${searchTerm}`);
    reset();
    mutate("");
  };

  return (
    <Navbar expand="lg">
      <Container fluid>
        <Navbar.Brand href="/">Ammijan</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            {loggedIn && (
              <>
                <NavDropdown title="My Account" id="navbarScrollingDropdown">
                  <NavDropdown.Item href={"/orders"}>
                    My Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item href={"/shipping-options"}>
                    Shipping Options
                  </NavDropdown.Item>
                  <NavDropdown.Item href={"/invoices"}>
                    My Invoices
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item>My Details</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href={"/cart"}>Cart</Nav.Link>
              </>
            )}
            <Nav.Link>Contact Us</Nav.Link>

            {loggedIn ? (
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            ) : (
              <>
                <Nav.Link href={"/register"}>Register</Nav.Link>
                <Nav.Link href={"/login"}>Login</Nav.Link>
              </>
            )}
          </Nav>
          <Form
            className="position-relative d-flex"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              {...register("search", { required: true })}
              onChange={handleInputChange}
            />
            <Button variant="outline-success" type="submit">
              Search
            </Button>
            {suggestionList?.data?.length > 0 && (
              <div className="position-absolute start-0 mt-1 p-2 bg-light w-100 suggestion-dropdown">
                <ul className="list-unstyled mb-0">
                  {suggestionList?.data?.map((suggestionCat) => (
                    <div key={suggestionCat?.category}>
                      <h5>
                        {suggestionCat?.category?.charAt(0).toUpperCase() +
                          suggestionCat?.category.slice(1)}
                      </h5>
                      {suggestionCat?.suggestions
                        ?.slice(0, 10)
                        ?.map((suggestion) => {
                          return suggestionCat?.category === "products" ? (
                            <Link
                              key={suggestion?._id}
                              style={{ textDecoration: "none" }}
                              onClick={clearInput}
                              to={`/search/${suggestion?.product}`}
                            >
                              <li>{suggestion?.product}</li>
                            </Link>
                          ) : suggestionCat?.category === "supplier" ? (
                            <Link
                              key={suggestion?._id}
                              style={{ textDecoration: "none" }}
                              onClick={clearInput}
                              to={`/search/${suggestion?.supplierName}`}
                            >
                              <li>{suggestion?.supplierName}</li>
                            </Link>
                          ) : null;
                        })}
                      {suggestionCat?.suggestions?.length > 10 && (
                        <div onClick={onMoreClick}>
                          <Link style={{ textDecoration: "none" }}>
                            <p>...More</p>
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </ul>
              </div>
            )}
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AvtrNavbar;
