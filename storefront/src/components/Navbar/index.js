import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const AvtrNavbar = () => {
  return (
    <Navbar expand="lg">
      <Container fluid>
        <Navbar.Brand>Avantor</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <NavDropdown title="My Account" id="navbarScrollingDropdown">
              <NavDropdown.Item>My Orders</NavDropdown.Item>
              <NavDropdown.Item>Shopping List</NavDropdown.Item>
              <NavDropdown.Item>Invoice Search</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>My Details</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link>Cart</Nav.Link>
            <Nav.Link>Contact Us</Nav.Link>
            <Nav.Link></Nav.Link>
            <Nav.Link></Nav.Link>
            <Nav.Link>Logout</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AvtrNavbar;
