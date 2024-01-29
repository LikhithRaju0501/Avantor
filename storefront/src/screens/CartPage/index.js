import React from "react";
import { useDeleteCartDetail, useGetCartDetails } from "../../api/cart";
import CartItem from "./CartItem";
import { CartSummary, CxSpinner } from "../../components";
import { useGlobalMessage } from "../../components/GlobalMessageService/GlobalMessageService";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

// https://colorlib.com/wp/template/table-06/
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

  const deleteCartEntry = (productId) => {
    mutate(productId);
  };

  const navigateToCheckout = () => {
    navigate("/checkout/1");
  };

  return (
    <div style={{ padding: "1vh 10vw" }}>
      {isLoading || isDeleteLoading ? (
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
              <CartSummary cart={data?.data} isCart={true}>
                <Button className="w-100 mt-2" onClick={navigateToCheckout}>
                  Proceed to Checkout
                </Button>
              </CartSummary>
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
