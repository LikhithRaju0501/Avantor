import React from "react";
import CxStepper from "../../components/CxStepper";
import DeliveryAddress from "./DeliveryAddress";
import ReviewOrder from "./ReviewOrder";

const steps = ["Shipping Details", "Review Order"];

const CheckoutPage = ({ step }) => {
  return (
    <div className="p-4" id="CheckoutPage">
      <CxStepper steps={steps} activeStep={step} />
      {Number(step) === 1 ? (
        <DeliveryAddress />
      ) : Number(step) === 2 ? (
        <ReviewOrder />
      ) : null}
    </div>
  );
};

export default CheckoutPage;
