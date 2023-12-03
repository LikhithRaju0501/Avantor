import React from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const OrderItemsModal = ({ entries, totalPrice, onHide, ...rest }) => {
  return (
    <Modal {...rest}>
      <Modal.Header>
        <h4>Items included in this Order</h4>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {entries?.map(
              ({ _id, product, quantity, price, productId }, index) => {
                return (
                  <tr key={_id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link
                        style={{ textDecoration: "none" }}
                        to={`/p/${productId}`}
                      >
                        {product}
                      </Link>
                    </td>
                    <td>{quantity}</td>
                    <td>{price?.formattedValue}</td>
                  </tr>
                );
              }
            )}
          </tbody>
        </Table>
        <div className="fw-bold" style={{ textAlign: "right" }}>
          Total Price: {totalPrice?.formattedValue}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderItemsModal;
