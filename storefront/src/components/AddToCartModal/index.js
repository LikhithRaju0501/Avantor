import React from "react";
import { Button, Modal, Table } from "react-bootstrap";

const AddToCartModal = ({ products, ...rest }) => {
  return (
    <Modal
      {...rest}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add To Cart
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Products to Add:</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map(({ product, quantity, productId }, index) => {
                return (
                  <tr key={productId}>
                    <td>{index + 1}</td>
                    <td>{product}</td>
                    <td>{quantity}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={rest.onHide}>
          Close
        </Button>
        <Button variant="success" onClick={rest.onHide}>
          Add To Cart
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddToCartModal;
