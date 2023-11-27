import React from "react";
import { Button, Form, FormControl, InputGroup, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";

const AddShippingOptionModal = ({
  addShippingOption,
  isAddShippingOptionLoading,
  ...rest
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const validations = {
    line1: { required: "*Line1 is required" },
    line2: { required: "*Line2 is required" },
    cityProvince: { required: "*City/Province is required" },
    pinCode: { required: "*Pin Code is required" },
    state: { required: "*State is required" },
    country: { required: "*Country is required" },
  };

  const formSubmit = (data) => {
    reset();
    addShippingOption({ ...data, pinCode: Number(data?.pinCode) });
  };

  return (
    <Modal
      {...rest}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <h4>Add Shipping Account</h4>
      </Modal.Header>
      <form onSubmit={handleSubmit(formSubmit)}>
        <Modal.Body>
          <div className="py-2">
            <InputGroup className="mb-1">
              <InputGroup.Text id="basic-addon1">Line1</InputGroup.Text>
              <FormControl {...register("line1", validations?.line1)} />
            </InputGroup>
            <div className="error-message small">{errors?.line1?.message}</div>
          </div>

          <div className="py-2">
            <InputGroup className="mb-1">
              <InputGroup.Text id="basic-addon1">Line2</InputGroup.Text>
              <FormControl {...register("line2", validations?.line2)} />
            </InputGroup>
            <div className="error-message small">{errors?.line2?.message}</div>
          </div>

          <div className="py-2">
            <InputGroup className="mb-1">
              <InputGroup.Text id="basic-addon1">City/Province</InputGroup.Text>
              <FormControl
                {...register("cityProvince", validations?.cityProvince)}
              />
            </InputGroup>
            <div className="error-message small">
              {errors?.cityProvince?.message}
            </div>
          </div>

          <div className="py-2">
            <InputGroup className="mb-1">
              <InputGroup.Text id="basic-addon1">Pin Code</InputGroup.Text>
              <FormControl
                type="number"
                {...register("pinCode", validations?.pinCode)}
              />
            </InputGroup>
            <div className="error-message small">
              {errors?.pinCode?.message}
            </div>
          </div>

          <div className="py-2">
            <InputGroup className="mb-1">
              <InputGroup.Text id="basic-addon1">State</InputGroup.Text>
              <FormControl {...register("state", validations?.state)} />
            </InputGroup>
            <div className="error-message small">{errors?.state?.message}</div>
          </div>

          <div className="py-2">
            <InputGroup className="mb-1">
              <InputGroup.Text id="basic-addon1">Country</InputGroup.Text>
              <FormControl {...register("country", validations?.country)} />
            </InputGroup>
            <div className="error-message small">
              {errors?.country?.message}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex flex-end">
            <Button
              variant="success"
              type="submit"
              disabled={isAddShippingOptionLoading}
            >
              Add
            </Button>

            <Button
              variant="dark"
              onClick={rest?.onHide}
              disabled={isAddShippingOptionLoading}
            >
              Close
            </Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AddShippingOptionModal;
