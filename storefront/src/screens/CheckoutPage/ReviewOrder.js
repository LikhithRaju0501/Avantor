import React from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useGetCartDetails } from "../../api/cart";
import { useAddEmailAddress, useRemoveEmailAddress } from "../../api/checkout";
import { useGlobalMessage } from "../../components/GlobalMessageService/GlobalMessageService";
import { CartSummary, CxSpinner } from "../../components";
import CartItem from "../CartPage/CartItem";
import { useNavigate } from "react-router";
import { usePlaceOrder } from "../../api/orders";
const ReviewOrder = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const { addMessage } = useGlobalMessage();

  const validations = {
    email: {
      required: "*Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "*Please enter a valid email",
      },
    },
  };

  const onAddEmailAddressSuccess = () => {
    reset();
    refetch();
    addMessage("Added Email Address", "success");
  };

  const onRemoveEmailAddressSuccess = () => {
    refetch();
    addMessage("Removed Email Address", "success");
  };

  const onPlaceOrderSuccess = () => {
    navigate("/orders");
  };

  const onAddEmailAddressError = (error) => {
    reset();
    addMessage(error?.response?.data?.message, "error");
  };

  const onRemoveEmailAddressError = (error) => {
    addMessage(error?.response?.data?.message, "error");
  };

  const onPlaceOrderError = (error) => {
    addMessage(error?.response?.data?.message, "error");
  };

  const { isLoading: getCartLoading, data, refetch } = useGetCartDetails();
  const { isLoading: isUpdateAddressLoading, mutate: updateAddress } =
    useAddEmailAddress(onAddEmailAddressSuccess, onAddEmailAddressError);
  const { isLoading: isRemoveAddressLoading, mutate: removeAddress } =
    useRemoveEmailAddress(
      onRemoveEmailAddressSuccess,
      onRemoveEmailAddressError
    );

  const { isLoading: isPlaceOrderLoading, mutate: placeOrder } = usePlaceOrder(
    onPlaceOrderSuccess,
    onPlaceOrderError
  );

  const formSubmit = ({ email }) => {
    updateAddress(email);
  };
  const removeEmailAddress = (email) => {
    removeAddress(email);
  };
  const createOrder = () => {
    placeOrder();
  };
  return getCartLoading ||
    isUpdateAddressLoading ||
    isRemoveAddressLoading ||
    isPlaceOrderLoading ? (
    <CxSpinner />
  ) : (
    <div className="d-flex justify-content-between p-4 ">
      <div style={{ width: "40%" }}>
        <h4>Review Order</h4>
        {/* Email */}
        <h5 className="mt-4">Email Notifications</h5>
        <div className="mb-3">
          Add email addresses to notify when you place this order.
        </div>
        <form onSubmit={handleSubmit(formSubmit)}>
          <InputGroup className="mb-1">
            <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
            <FormControl {...register("email", validations?.email)} />
          </InputGroup>
          <div className="error-message small">{errors?.email?.message}</div>
          <Button variant="outline-success my-2" type="submit">
            Add Email
          </Button>
        </form>
        <div className="text-break fw-bold">
          {data?.data?.primaryEmailAddress}
        </div>
        {data?.data?.secondaryEmailAddress?.map((emailId, index) => (
          <div className="text-break" key={index}>
            {emailId}{" "}
            <span
              style={{ cursor: "pointer" }}
              onClick={() => removeEmailAddress(emailId)}
            >
              x
            </span>
          </div>
        ))}
        {/* Email End */}

        {/* Shipping Address */}
        <div className="h5 mt-4">
          Shipping Address
          <span className="small">
            (
            <a className="cx-class" onClick={() => navigate("/checkout/1")}>
              change here
            </a>
            )
          </span>
        </div>
        <div className="default-shipping-option">
          <div className="text-break">{data?.data?.addresses?.line1}</div>
          <div className="text-break">{data?.data?.addresses?.line2}</div>
          <div className="text-break">
            {data?.data?.addresses?.cityProvince},{data?.data?.addresses?.state}
          </div>
          <div className="text-break mb-3">
            {data?.data?.addresses?.pinCode}
          </div>
        </div>
        {/* Shipping Address End */}

        {/* Products */}
        <div className="h5 mt-4">
          Products
          <span className="small">
            (
            <a className="cx-class" onClick={() => navigate("/cart")}>
              change here
            </a>
            )
          </span>
        </div>
        <div>
          {data?.data?.entries?.map((item) => (
            <CartItem key={item?._id} item={item} readOnly={true} />
          ))}
        </div>
        {/* Products End*/}
      </div>
      <div>
        <CartSummary cart={data?.data}>
          <Button className="w-100 mt-2" onClick={createOrder}>
            Place Order
          </Button>
        </CartSummary>
      </div>
    </div>
  );
};

export default ReviewOrder;
