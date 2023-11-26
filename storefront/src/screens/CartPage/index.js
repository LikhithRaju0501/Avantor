import React from "react";
import { useDeleteCartDetail, useGetCartDetails } from "../../api/cart";
import CartItem from "./CartItem";
import { CartSummary, CxSpinner } from "../../components";

const CartPage = () => {
  const onDeleteSuccess = () => {
    refetch();
  };
  const { isLoading, data, isError, error, refetch } = useGetCartDetails();

  const {
    isLoading: isDeleteLoading,
    mutate,
    error: deleteEntryError,
  } = useDeleteCartDetail(onDeleteSuccess);

  const deleteCartEntry = (productId) => {
    mutate(productId);
  };

  return (
    <div style={{ padding: "1vh 10vw" }}>
      {isLoading ? (
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
