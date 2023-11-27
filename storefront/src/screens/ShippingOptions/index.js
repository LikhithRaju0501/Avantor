import React, { useState } from "react";
import {
  useAddShippingOption,
  useGetShippingOptions,
  useMakeDefaultShippingOption,
  useDeleteShippingOption,
} from "../../api/shippingOptions";
import { CxSpinner } from "../../components";
import "./index.css";
import { Button } from "react-bootstrap";
import { useGlobalMessage } from "../../components/GlobalMessageService/GlobalMessageService";
import "./index.css";
import AddShippingOptionModal from "./AddShippingOptionModal";

const ShippingOptions = () => {
  const [addShippingOptionModal, setAddShippingOptionModal] = useState(false);
  const { addMessage } = useGlobalMessage();
  const {
    isLoading: isShippingOptionsLoading,
    data: shippingOptions,
    isFetching: isShippingOptionsFetching,
    refetch,
  } = useGetShippingOptions();

  const onAddShippingOptionSuccess = () => {
    setAddShippingOptionModal(false);
    refetch();
    addMessage("Added new Address", "success");
  };
  const { isLoading: isAddShippingOptionLoading, mutate: addShippingOption } =
    useAddShippingOption(onAddShippingOptionSuccess);

  const onMakeDefaultAddressSuccesss = () => {
    refetch();
    addMessage("Changed default Address", "success");
  };
  const { isLoading: isMakeDefaultLoading, mutate: makeDefaultAddress } =
    useMakeDefaultShippingOption(onMakeDefaultAddressSuccesss);

  const onDeleteAddressSuccesss = () => {
    refetch();
    addMessage("Deleted Address", "success");
  };
  const { isLoading: isDeleteAddressLoading, mutate: deleteAddressAddress } =
    useDeleteShippingOption(onDeleteAddressSuccesss);

  const getDefaultAddress = (shippingOptionData) => {
    return shippingOptionData?.addresses?.find((option) => option?.isDefault);
  };

  const getAlternateAddress = (shippingOptionData) => {
    return shippingOptionData?.addresses?.filter(
      (option) => !option?.isDefault
    );
  };

  const makeDefault = (addressId) => {
    makeDefaultAddress(addressId);
  };

  const deleteAddress = (addressId) => {
    deleteAddressAddress(addressId);
  };

  return (
    <>
      {isShippingOptionsLoading ? (
        <CxSpinner />
      ) : (
        <div className="px-5">
          <h4 className="mt-3">Shipping Options:</h4>
          <p className="text-break text-center">
            Store your shipping information and default settings below.When you
            proceed to checkout page, your stored information will be available.
            Add a new shipping account{" "}
            <a
              className="cx-class"
              onClick={() => setAddShippingOptionModal(true)}
            >
              here
            </a>
            .
          </p>
          {shippingOptions?.data?.addresses?.length ? (
            <div>
              <h5>Default Shipping Option:</h5>
              <div className="default-shipping-option">
                <div className="text-break">
                  {getDefaultAddress(shippingOptions?.data)?.line1}
                </div>
                <div className="text-break">
                  {getDefaultAddress(shippingOptions?.data)?.line2}
                </div>
                <div className="text-break">
                  {getDefaultAddress(shippingOptions?.data)?.cityProvince},
                  {getDefaultAddress(shippingOptions?.data)?.state}
                </div>
                <div className="text-break">
                  {getDefaultAddress(shippingOptions?.data)?.pinCode}
                </div>
              </div>
              {getAlternateAddress(shippingOptions?.data)?.length ? (
                <h5 className="mt-3">Alternate Shipping Options:</h5>
              ) : (
                <h5 className="mt-3">No Alternate Options Available.</h5>
              )}
              <div className="text-break row">
                {getAlternateAddress(shippingOptions?.data)?.map((address) => {
                  return (
                    <div
                      key={address?._id}
                      className="col-md-6 col-lg-6 col-xl-6 mt-2"
                    >
                      <div className="alternate-shipping-option">
                        <div className="text-break">{address?.line1}</div>
                        <div className="text-break">{address?.line2}</div>
                        <div className="text-break">
                          {address?.cityProvince},{address?.state}
                        </div>
                        <div className="text-break">{address?.pinCode}</div>
                        <div className="d-flex justify-content-between mt-2">
                          <Button
                            onClick={() => makeDefault(address?._id)}
                            disabled={
                              isMakeDefaultLoading || isShippingOptionsFetching
                            }
                          >
                            {isMakeDefaultLoading || isShippingOptionsFetching
                              ? "Loading..."
                              : "Make Default"}
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => deleteAddress(address?._id)}
                            disabled={
                              isDeleteAddressLoading ||
                              isShippingOptionsFetching
                            }
                          >
                            {isDeleteAddressLoading || isShippingOptionsFetching
                              ? "Loading..."
                              : "Remove Address"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <h4>No Shipping Options</h4>
          )}
          <AddShippingOptionModal
            show={addShippingOptionModal}
            isAddShippingOptionLoading={isAddShippingOptionLoading}
            addShippingOption={addShippingOption}
            onHide={() => setAddShippingOptionModal(false)}
          />
        </div>
      )}
    </>
  );
};

export default ShippingOptions;
