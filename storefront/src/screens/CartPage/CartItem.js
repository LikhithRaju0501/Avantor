import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { CxItemCounter } from "../../components";
import { useForm, FormProvider } from "react-hook-form";

const CartItem = ({ item, deleteCartEntry }) => {
  const { product, productId, supplier, description, quantity, price } = item;
  const methods = useForm();

  return (
    <div className="cartItem">
      <h4>
        <Link style={{ textDecoration: "none" }} to={`/p/${productId}`}>
          {product}
        </Link>
      </h4>
      <div className="item-description">
        <p>{description}</p>
        <span>
          Price: <span className="fw-bold">{price?.formattedValue}</span>
        </span>
        <div>
          <span>Supplier</span> : {supplier?.supplierName || "-"}
        </div>
      </div>
      <div
        className="d-flex justify-content-between"
        style={{ marginTop: "20px", alignItems: "flex-end" }}
      >
        <div>
          <FormProvider {...methods}>
            <CxItemCounter quantity={quantity} />
          </FormProvider>
          <Button style={{ marginTop: "15px" }} variant="primary">
            Update Quantity
          </Button>
        </div>
        <Button variant="danger" onClick={() => deleteCartEntry(productId)}>
          Remove Item
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
