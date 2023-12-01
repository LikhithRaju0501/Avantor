import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useGetShippingOptions } from "../../api/shippingOptions";
import CxSpinner from "../CxSpinner";

const ChangeDeliveryAddress = ({
  onHide,
  currentAddress,
  setSelectedAddressId,
  isUpdateAddressLoading,
  ...rest
}) => {
  const [fetchedData, setFetchedData] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(currentAddress);
  const {
    isLoading: isShippingOptionsLoading,
    data: shippingOptions,
    isFetching: isShippingOptionsFetching,
  } = useGetShippingOptions();

  useEffect(() => {
    if (
      shippingOptions &&
      !isShippingOptionsFetching &&
      !isShippingOptionsLoading
    ) {
      setFetchedData([...shippingOptions?.data?.addresses]);
    }
  }, [shippingOptions, isShippingOptionsFetching, isShippingOptionsLoading]);

  return isShippingOptionsFetching ? (
    <CxSpinner />
  ) : (
    <Modal {...rest} scrollable>
      <Modal.Header>
        <h4>Add Shipping Account</h4>
      </Modal.Header>
      <Modal.Body>
        <span className="text-break text-center">
          Click on <span className="fw-bold"> Change Address</span> to apply
          changes
        </span>
        <div className="mt-3">
          {fetchedData?.map(
            ({
              cityProvince,
              country,
              isDefault,
              line1,
              line2,
              pinCode,
              state,
              _id,
            }) => {
              return (
                <div
                  key={_id}
                  className="mb-3"
                  onClick={() => setSelectedAddress(_id)}
                >
                  <div
                    className="default-shipping-option"
                    style={{
                      width: "95%",
                      cursor: "pointer",
                      boxShadow:
                        selectedAddress === _id &&
                        "0 1px 6px rgba(0, 0, 255, 0.12), 0 1px 4px rgba(0, 0, 255, 0.24), 0 1px 6px rgba(0, 0, 255, 0.12), 0 1px 6px rgba(0, 0, 255, 0.12)",
                    }}
                  >
                    <div className="text-break">{line1}</div>
                    <div className="text-break">{line2}</div>
                    <div className="text-break">
                      {cityProvince},{state}
                    </div>
                    <div className="text-break">{pinCode}</div>
                    <div className="text-break mb-3">{country}</div>
                    {isDefault && <div className="fw-bold">Default</div>}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex flex-end">
          <Button
            variant="success"
            type="submit"
            onClick={() => setSelectedAddressId(selectedAddress)}
            disabled={isUpdateAddressLoading}
          >
            Change Address
          </Button>

          <Button
            variant="dark"
            onClick={onHide}
            disabled={isUpdateAddressLoading}
          >
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeDeliveryAddress;
