import React from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useGlobalMessage } from "../../components/GlobalMessageService/GlobalMessageService";
import { useSearchParams } from "react-router-dom";
import { useResetPassword } from "../../api/register";
import CxSpinner from "../../components/CxSpinner";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  let navigate = useNavigate();
  const { addMessage } = useGlobalMessage();
  const [searchParams, setSearchParams] = useSearchParams();

  const params = new URLSearchParams(searchParams);
  const onSuccess = (data) => {
    if (data?.data?.message) {
      addMessage(data.data.message, "success");
    }
    navigate("/login");
  };

  const onError = (error) => {
    if (error?.response?.data?.message) {
      addMessage(error.response.data.message, "error");
    }
  };

  const { mutate, isLoading: isResetPasswordLoading } = useResetPassword(
    onSuccess,
    onError
  );

  const validations = {
    newPassword: {
      required: "New Password is required",
      minLength: {
        value: 6,
        message: "Password should be minimun 6 characters",
      },
    },
    confirmPassword: {
      required: "Confirm Password is required",
      minLength: {
        value: 6,
        message: "Password should be minimun 6 characters",
      },
    },
  };

  const formSubmit = (data) => {
    const { newPassword, confirmPassword } = data;
    if (newPassword !== confirmPassword) {
      addMessage("New Password and Confirm Password should match", "error");
      return;
    }
    mutate({
      userId: params?.get("userId") || "",
      newPassword,
    });
  };

  const formError = (error) => {
    console.log(error);
  };

  return !isResetPasswordLoading ? (
    <div className="login-page" id="LoginPage">
      <h4 className="text-center">Reset Password</h4>
      <Form
        onSubmit={handleSubmit(formSubmit, formError)}
        className="container"
      >
        <Form.Group controlId="formBasicPassword" className="my-2">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="New Password"
            {...register("newPassword", validations.newPassword)}
          />
          {errors?.newPassword?.message && (
            <div className="text-danger small my-2">
              {errors?.newPassword?.message}
            </div>
          )}
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword", validations.confirmPassword)}
          />
          {errors?.confirmPassword?.message && (
            <div className="text-danger small my-2">
              {errors?.confirmPassword?.message}
            </div>
          )}
        </Form.Group>
        <Button variant="primary" type="submit" className="my-3">
          Reset
        </Button>
      </Form>
    </div>
  ) : (
    <CxSpinner />
  );
};

export default ResetPassword;
