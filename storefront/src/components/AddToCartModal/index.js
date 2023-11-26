import React from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { useAddToCart } from "../../api/cart";
import { useNavigate } from "react-router-dom";

const AddToCartModal = ({ products, ...rest }) => {
  const addToCartSuccess = () => navigate(`/cart`);
  const {
    isLoading: isAddToCartLoading,
    mutate,
    error: addToCartError,
  } = useAddToCart(addToCartSuccess);
  let navigate = useNavigate();

  const addToCart = () => {
    mutate({
      productId: products?.[0]?.productId,
      quantity: products?.[0]?.quantity,
    });
  };

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
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map(({ product, quantity, productId, price }, index) => {
                return (
                  <tr key={productId}>
                    <td>{index + 1}</td>
                    <td>{product}</td>
                    <td>{quantity}</td>
                    <td>{price?.formattedValue}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={rest?.onHide}>
          Close
        </Button>
        <Button
          variant="success"
          onClick={addToCart}
          disabled={isAddToCartLoading}
        >
          {isAddToCartLoading ? "Loading..." : "Add To Cart"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddToCartModal;
