import React, { useState } from "react";
import { useGetCartDetails } from "../../api/cart";
import {
  CartSummary,
  ChangeDeliveryAddress,
  CxSpinner,
} from "../../components";
import { useUpdateDeliveryAddress } from "../../api/checkout";
import { useGlobalMessage } from "../../components/GlobalMessageService/GlobalMessageService";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
const DeliveryAddress = () => {
  const [changeDeliveryAddress, setChangeDeliveryAddress] = useState(false);
  const { addMessage } = useGlobalMessage();
  const navigate = useNavigate();
  const onUpdateDeliveryAddressSuccess = () => {
    refetch();

    setChangeDeliveryAddress(false);
    addMessage("Updated Delivery Address", "success");
  };

  const {
    isLoading: getCartLoading,
    data,
    isError,
    error: getCartError,
    refetch,
    isFetching: getCartFetching,
  } = useGetCartDetails();

  const { isLoading: isUpdateAddressLoading, mutate: updateAddress } =
    useUpdateDeliveryAddress(onUpdateDeliveryAddressSuccess);

  const setSelectedAddressId = (addressId) => {
    updateAddress(addressId);
  };
  return getCartLoading ? (
    <CxSpinner />
  ) : (
    <div className="d-flex justify-content-between p-4">
      <div>
        <h5>Shipping Address:</h5>
        <div className="default-shipping-option">
          <div className="text-break">{data?.data?.addresses?.line1}</div>
          <div className="text-break">{data?.data?.addresses?.line2}</div>
          <div className="text-break">
            {data?.data?.addresses?.cityProvince},{data?.data?.addresses?.state}
          </div>
          <div className="text-break mb-3">
            {data?.data?.addresses?.pinCode}
          </div>
          <a
            className="cx-class"
            onClick={() => setChangeDeliveryAddress(true)}
          >
            Change
          </a>
          {changeDeliveryAddress && (
            <ChangeDeliveryAddress
              show={changeDeliveryAddress}
              onHide={() => setChangeDeliveryAddress(false)}
              currentAddress={data?.data?.addresses?._id}
              setSelectedAddressId={setSelectedAddressId}
              isUpdateAddressLoading={isUpdateAddressLoading || getCartFetching}
            />
          )}
        </div>
      </div>
      <div>
        <CartSummary cart={data?.data}>
          <Button
            className="w-100 mt-2"
            onClick={() => navigate("/checkout/2")}
          >
            Review Order
          </Button>
          <Button
            variant="outline-primary"
            className="w-100 mt-2"
            onClick={() => navigate("/cart")}
          >
            Go To Cart
          </Button>
        </CartSummary>
      </div>
    </div>
  );
};

export default DeliveryAddress;
