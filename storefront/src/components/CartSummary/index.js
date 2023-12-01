import React from "react";
import "./index.css";
import { Button } from "react-bootstrap";

const CartSummary = ({ cart, children }) => {
  const { totalPrice } = cart;
  return (
    <div className="cart-summary">
      <h4>Cart Summary:</h4>
      <div>
        <span>
          Item Total:{" "}
          <span className="fw-bold">{totalPrice?.formattedValue}</span>
        </span>
      </div>
      {children}
    </div>
  );
};

export default CartSummary;
