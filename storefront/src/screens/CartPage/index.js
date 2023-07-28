import React from "react";
import { Spinner } from "react-bootstrap";
import { useGetCartDetails } from "../../api/cart";
import CartItem from "./CartItem";

const CartPage = () => {
  const { isLoading, data, isError, error } = useGetCartDetails();
  return (
    <div style={{ padding: "1vh 10vw" }}>
      {isLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <>
          <h2>Your Cart</h2>
          {data?.data?.entries?.map((item) => (
            <CartItem key={item?._id} item={item} />
          ))}
        </>
      )}
    </div>
  );
};

export default CartPage;
