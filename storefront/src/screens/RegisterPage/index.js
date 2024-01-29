import React, { useState } from "react";
import "./index.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { useRegisterUser } from "../../api/register";
import { CxStepper } from "../../components";
import { useGlobalMessage } from "../../components/GlobalMessageService/GlobalMessageService";

const steps = ["Tell us about you", "Shipping Account"];
const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [emailAddressData, setEmailAddressData] = useState();

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: errorsEmail },
  } = useForm();
  const {
    register: registerAddress,
    handleSubmit: handleAddressSubmit,
    formState: { errors: errorsAddress },
  } = useForm();
  let navigate = useNavigate();
  const { addMessage } = useGlobalMessage();

  const onCreateUserSuccess = () => {
    navigate("/login");
  };
  const onCreateUserError = (error) => {
    addMessage(error?.response?.data?.message, "error");
    setCurrentStep(1);
  };

  const { mutate: createUser, isLoading: createUserLoading } = useRegisterUser(
    onCreateUserSuccess,
    onCreateUserError
  );

  const validations = {
    username: { required: "Name is required" },
    email: { required: "Email is required" },
    password: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password should be minimun 6 characters",
      },
    },
    line1: { required: "*Line1 is required" },
    line2: { required: "*Line2 is required" },
    cityProvince: { required: "*City/Province is required" },
    pinCode: { required: "*Pin Code is required" },
    state: { required: "*State is required" },
    country: { required: "*Country is required" },
    termsAndConditions: { required: "*Please agree to continue" },
  };

  const emailFormSubmit = (data) => {
    setEmailAddressData({ ...data });
    setCurrentStep(2);
  };
  const addressFormSubmit = (data) => {
    createUser({ ...emailAddressData, address: { ...data } });
  };

  return (
    <div>
      <CxStepper steps={steps} activeStep={currentStep} />
      {currentStep === 1 ? (
        <div className="register-page">
          <Form onSubmit={handleEmailSubmit(emailFormSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                {...registerEmail("username", validations.username)}
              />
              <div style={{ color: "red" }}>
                {errorsEmail?.username?.message}
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                {...registerEmail("email", validations.email)}
              />
              <div style={{ color: "red" }}>{errorsEmail?.email?.message}</div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                {...registerEmail("password", validations.password)}
              />
              <div style={{ color: "red" }}>
                {errorsEmail?.password?.message}
              </div>
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button
                variant="outline-primary"
                style={{ width: "40%" }}
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
              <Button
                variant="outline-success"
                type="submit"
                style={{ width: "40%" }}
              >
                Next
              </Button>
            </div>
          </Form>
        </div>
      ) : currentStep === 2 ? (
        <div className="p-4 register-page">
          <form onSubmit={handleAddressSubmit(addressFormSubmit)}>
            <div className="py-2">
              <InputGroup className="mb-1">
                <InputGroup.Text id="basic-addon1">Line1</InputGroup.Text>
                <FormControl
                  {...registerAddress("line1", validations?.line1)}
                />
              </InputGroup>
              <div className="error-message small">
                {errorsAddress?.line1?.message}
              </div>
            </div>

            <div className="py-2">
              <InputGroup className="mb-1">
                <InputGroup.Text id="basic-addon1">Line2</InputGroup.Text>
                <FormControl
                  {...registerAddress("line2", validations?.line2)}
                />
              </InputGroup>
              <div className="error-message small">
                {errorsAddress?.line2?.message}
              </div>
            </div>

            <div className="py-2">
              <InputGroup className="mb-1">
                <InputGroup.Text id="basic-addon1">
                  City/Province
                </InputGroup.Text>
                <FormControl
                  {...registerAddress(
                    "cityProvince",
                    validations?.cityProvince
                  )}
                />
              </InputGroup>
              <div className="error-message small">
                {errorsAddress?.cityProvince?.message}
              </div>
            </div>

            <div className="py-2">
              <InputGroup className="mb-1">
                <InputGroup.Text id="basic-addon1">Pin Code</InputGroup.Text>
                <FormControl
                  type="number"
                  {...registerAddress("pinCode", validations?.pinCode)}
                />
              </InputGroup>
              <div className="error-message small">
                {errorsAddress?.pinCode?.message}
              </div>
            </div>

            <div className="py-2">
              <InputGroup className="mb-1">
                <InputGroup.Text id="basic-addon1">State</InputGroup.Text>
                <FormControl
                  {...registerAddress("state", validations?.state)}
                />
              </InputGroup>
              <div className="error-message small">
                {errorsAddress?.state?.message}
              </div>
            </div>

            <div className="py-2">
              <InputGroup className="mb-1">
                <InputGroup.Text id="basic-addon1">Country</InputGroup.Text>
                <FormControl
                  {...registerAddress("country", validations?.country)}
                />
              </InputGroup>
              <div className="error-message small">
                {errorsAddress?.country?.message}
              </div>
            </div>
            <div className="mb-1">
              <Form.Check
                type="checkbox"
                label="I agree to Ammijan's Terms and Conditions"
                {...registerAddress(
                  "termsAndConditions",
                  validations?.termsAndConditions
                )}
              />
              <div className="error-message small">
                {errorsAddress?.termsAndConditions?.message}
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <Button
                variant="outline-primary"
                style={{ width: "40%" }}
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline-success"
                style={{ width: "40%" }}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default RegisterPage;
