import React, { useState } from "react";
import "./index.css";
import OffersModal from "./OffersModal";

const CartSummary = ({ cart, children, isCart = false }) => {
  const [offersModal, setOffersModal] = useState(false);

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
      {isCart && (
        <div className="text-center my-2">
          <a className="cx-link" onClick={() => setOffersModal(true)}>
            Offers & Promo Codes
          </a>
        </div>
      )}
      {offersModal && (
        <OffersModal show={offersModal} onHide={() => setOffersModal(false)} />
      )}
    </div>
  );
};

export default CartSummary;
