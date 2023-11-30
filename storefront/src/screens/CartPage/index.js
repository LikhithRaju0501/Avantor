import React from "react";
import { useDeleteCartDetail, useGetCartDetails } from "../../api/cart";
import { useGetNavigateToCheckoutStep } from "../../api/checkout";
import CartItem from "./CartItem";
import { CartSummary, CxSpinner } from "../../components";
import { useGlobalMessage } from "../../components/GlobalMessageService/GlobalMessageService";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { addMessage } = useGlobalMessage();
  let navigate = useNavigate();

  const onDeleteSuccess = () => {
    addMessage("Deleted Successfully", "success");
    refetch();
  };
  const onDeleteError = () => {
    addMessage("Something went wrong, Please try again later", "error");
  };
  const onGetCartError = () => {
    addMessage("Failed to Fetch Cart", "error");
  };
  const navigateToCheckout = () => {
    fetchValidateCheckout(1);
  };
  const navigateToCheckoutSuccess = () => navigate(`/checkout/1`);
  const navigateToCheckoutError = (error) => {
    addMessage(error?.response?.data?.message, "error");
  };

  const {
    isLoading,
    data,
    isError,
    error: getCartError,
    refetch,
  } = useGetCartDetails(onGetCartError);

  const {
    isLoading: isDeleteLoading,
    mutate,
    error: deleteEntryError,
  } = useDeleteCartDetail(onDeleteSuccess, onDeleteError);

  const {
    isLoading: isValidateCheckoutLoading,
    refetch: fetchValidateCheckout,
  } = useGetNavigateToCheckoutStep(
    1,
    navigateToCheckoutSuccess,
    navigateToCheckoutError
  );

  const deleteCartEntry = (productId) => {
    mutate(productId);
  };

  return (
    <div style={{ padding: "1vh 10vw" }}>
      {isLoading || isValidateCheckoutLoading || isDeleteLoading ? (
        <CxSpinner />
      ) : (
        <>
          <h2>Your Cart</h2>
          {data?.data?.entries?.length ? (
            <div className="d-flex justify-content-between">
              <div>
                {data?.data?.entries?.map((item) => (
                  <CartItem
                    key={item?._id}
                    item={item}
                    deleteCartEntry={deleteCartEntry}
                  />
                ))}
              </div>
              <CartSummary
                cart={data?.data}
                isNextButton={true}
                nextButtonHeader="Proceed to Checkout"
                nextButtonClick={navigateToCheckout}
              />
            </div>
          ) : (
            <h2>Empty Cart</h2>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
