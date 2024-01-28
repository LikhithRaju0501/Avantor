import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { useGetOffers } from "../../api/cart";
import CxSpinner from "../CxSpinner";

const OffersModal = ({ ...rest }) => {
  const [radioValue, setRadioValue] = useState("");
  const [textValue, setTextValue] = useState("");

  const { isLoading, data, isError } = useGetOffers();

  const { control, register, setValue } = useForm({
    mode: "onChange",
  });

  const radioChangeHandler = (e) => {
    setValue("textInput", "");
    setTextValue("");
    setRadioValue(e?.target?.value);
  };

  const textChangeHandler = (e) => {
    setValue("radioOption", "");
    setRadioValue("");
    setTextValue(e?.target?.value);
  };

  const onSubmit = () => {
    console.log(radioValue, textValue);
  };

  const capitalizeString = (string) => {
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
  };

  const getSavings = () => {
    return data?.data?.find((offer) => offer?._id === radioValue)?.savings
      ?.formattedValue;
  };

  return (
    <Modal
      {...rest}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Offers or Promo Codes
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading ? (
          <form className="px-3">
            <div className="mb-3">
              <label className="fw-bold my-3">
                Choose an Available Option:
              </label>
              <div>
                <Controller
                  name="radioOption"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      {data?.data?.map(
                        ({
                          _id,
                          isDisabled,
                          name,
                          discountDisplay,
                          discountTAndC,
                        }) => {
                          return (
                            <div
                              key={_id}
                              className={`row offer-container p-2 mb-2 ${
                                isDisabled && "disabled-radio-btn"
                              }`}
                            >
                              <div className="col-1 align-self-center">
                                <Form.Check
                                  {...field}
                                  type="radio"
                                  value={_id}
                                  id={_id}
                                  onChange={(e) => radioChangeHandler(e)}
                                  checked={radioValue === _id}
                                  disabled={isDisabled}
                                />
                              </div>
                              <div className="col-11">
                                <span className="fw-bold">{name}</span>
                                <div className="small">
                                  {capitalizeString(discountDisplay)} -
                                  {capitalizeString(discountTAndC)}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </>
                  )}
                />
              </div>
            </div>
            <div className="text-center">------- OR -------</div>
            <div>
              <div>
                <label className="fw-bold my-3">Apply Promo Code:</label>
              </div>
              <div className="offer-container p-1">
                <input
                  {...register("textInput", {
                    required: "This field is required",
                  })}
                  type="text"
                  className="w-100 border-0"
                  onChange={(e) => textChangeHandler(e)}
                />
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <CxSpinner pageLevelSpinner={false} />
          </div>
        )}
        {radioValue && (
          <div className="text-center my-2">
            <div>
              <span className="fw-bold">Total Cost upon applying : </span>
              {getSavings()}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          disabled={!radioValue && !textValue}
          onClick={onSubmit}
        >
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OffersModal;
