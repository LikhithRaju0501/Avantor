import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetNavigateToCheckoutStep } from "../../api/checkout";
import { CxSpinner } from "../../components";
import CheckoutPage from ".";
import { useGlobalMessage } from "../../components/GlobalMessageService/GlobalMessageService";
const CheckoutStepsGuard = () => {
  const navigate = useNavigate();
  const { addMessage } = useGlobalMessage();
  const { checkoutStep } = useParams();
  const navigateToCheckoutSuccess = () => {};
  const navigateToCheckoutError = (error) => {
    addMessage(error?.response?.data?.message, "error");
  };

  const { isLoading: isValidateCheckoutLoading, status } =
    useGetNavigateToCheckoutStep(
      checkoutStep,
      true,
      navigateToCheckoutSuccess,
      navigateToCheckoutError
    );

  return isValidateCheckoutLoading ? (
    <CxSpinner />
  ) : status === "success" ? (
    <CheckoutPage step={checkoutStep} />
  ) : (
    navigate("/cart")
  );
};

export default CheckoutStepsGuard;
