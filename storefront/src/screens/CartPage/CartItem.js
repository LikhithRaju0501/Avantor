import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { CxItemCounter } from "../../components";
import { useForm, FormProvider } from "react-hook-form";

const CartItem = ({ item, deleteCartEntry, readOnly = false }) => {
  const { product, productId, supplier, description, quantity, price } = item;

  return (
    <div className="cartItem mb-4">
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
        <div>
          <span>Quantity</span> : {quantity || "-"}
        </div>
      </div>
      {!readOnly && (
        <Button
          variant="danger"
          onClick={() => deleteCartEntry(productId)}
          className="mt-2"
        >
          Remove Item
        </Button>
      )}
    </div>
  );
};

export default CartItem;
