import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLoginUser, useResetPasswordEmail } from "../../api/register";
import "./index.css";
import { useGlobalMessage } from "../../components/GlobalMessageService/GlobalMessageService";
import CxSpinner from "../../components/CxSpinner";

const LoginPage = () => {
  const [UserNotExistsError, setUserNotExistsError] = useState(false);
  const [IncorrectCred, setIncorrectCred] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  let navigate = useNavigate();
  const { addMessage } = useGlobalMessage();

  const onSuccess = (data) => {
    const { token } = data?.data;
    localStorage.setItem("token", token);
    navigate("/");
  };

  const onError = (error) => {
    const { data, status } = error?.response;
    if (status === 404) {
      setUserNotExistsError(data?.message);
      setIncorrectCred(false);
    } else if (status === 401) {
      setIncorrectCred(data?.message);
      setUserNotExistsError(false);
    } else {
      //Show global error message
    }
  };

  const onResetPasswordMailSuccess = (data) => {
    addMessage("Mail has been sent to your registered mail ID", "success");
  };
  const onResetPasswordMailError = (error) => {
    if (error?.response?.data?.message) {
      addMessage(error.response.data.message, "error");
    }
  };

  const { mutate, isLoading: postLoading } = useLoginUser(onSuccess, onError);
  const { mutate: resetPasswordMail, isLoading: isResetPasswordMailLoading } =
    useResetPasswordEmail(onResetPasswordMailSuccess, onResetPasswordMailError);

  const validations = {
    email: { required: "Email is required" },
    password: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password should be minimun 6 characters",
      },
    },
  };

  const formSubmit = async (data) => {
    mutate(data);
  };

  const formError = (error) => {
    console.log(error);
  };

  const sendResetPasswordMail = () => {
    const email = watch("email");
    if (!email) {
      addMessage("Please Enter EmailID", "error");
      return;
    }
    resetPasswordMail({ email, baseSite: window.location.origin });
  };

  return !isResetPasswordMailLoading && !postLoading ? (
    <div className="login-page" id="LoginPage">
      {UserNotExistsError && (
        <Alert variant="warning">
          <span>
            {UserNotExistsError}, please <Link to={"/register"}>register</Link>{" "}
          </span>
        </Alert>
      )}

      {IncorrectCred && (
        <Alert variant="danger">
          <span>{IncorrectCred}</span>
        </Alert>
      )}

      <Form onSubmit={handleSubmit(formSubmit, formError)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            {...register("email", validations.email)}
          />
          {errors?.email?.message && (
            <div className="text-danger small">{errors.email.message}</div>
          )}
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            {...register("password", validations.password)}
          />
          {errors?.password?.message && (
            <div className="text-danger small">{errors.password.message}</div>
          )}
        </Form.Group>
        <div className="my-3">
          <a onClick={sendResetPasswordMail} className="small cursor-pointer">
            Forgot Password
          </a>
        </div>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  ) : (
    <CxSpinner />
  );
};

export default LoginPage;
