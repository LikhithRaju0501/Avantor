import React, { useState } from "react";
import "./index.css";
import OffersModal from "./OffersModal";
import { useApplyOffer, useGetCartDetails } from "../../api/cart";
import { useGlobalMessage } from "../GlobalMessageService/GlobalMessageService";

const CartSummary = ({ cart, children, isCart = false }) => {
  const [offersModal, setOffersModal] = useState(false);
  const { addMessage } = useGlobalMessage();

  const applyOfferSuccess = () => {
    addMessage("Applied Offer", "success");
    setOffersModal(false);
    refetch();
  };

  const applyOfferError = () => {
    addMessage("Something went wrong, please try again later", "error");
    setOffersModal(false);
  };
  const { isLoading: isApplyOfferLoading, mutate } = useApplyOffer(
    applyOfferSuccess,
    applyOfferError
  );
  const { refetch } = useGetCartDetails();

  const applyOffer = (offerId) => {
    mutate({ offerId });
  };

  const { totalPrice, offer, subTotalPrice } = cart;
  return (
    <div className="cart-summary">
      <h4>Cart Summary:</h4>
      <hr />
      <div>
        <span className="small">
          Item Total:{" "}
          <span className="fw-bold">{totalPrice?.formattedValue}</span>
        </span>
      </div>

      {offer?.costReduction?.value && offer?.costReduction?.value !== 0 && (
        <div>
          <span className="small">
            Discount:{" "}
            <span className="fw-bold">
              {offer?.costReduction?.formattedValue}
            </span>
          </span>
        </div>
      )}

      <hr />

      <div>
        <span>
          Final Price:{" "}
          <span className="fw-bold">{subTotalPrice?.formattedValue}</span>
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
        <OffersModal
          show={offersModal}
          onHide={() => setOffersModal(false)}
          applyOffer={applyOffer}
          isApplyOfferLoading={isApplyOfferLoading}
        />
      )}
    </div>
  );
};

export default CartSummary;
