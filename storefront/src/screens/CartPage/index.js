import React from "react";
import { useDeleteCartDetail, useGetCartDetails } from "../../api/cart";
import CartItem from "./CartItem";
import { CxSpinner } from "../../components";

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
          {data?.data?.entries?.map((item) => (
            <CartItem
              key={item?._id}
              item={item}
              deleteCartEntry={deleteCartEntry}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default CartPage;
