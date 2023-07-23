import React, { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLoginUser } from "../../api/register";
import "./index.css";

const LoginPage = () => {
  const [UserNotExistsError, setUserNotExistsError] = useState(false);
  const [IncorrectCred, setIncorrectCred] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  let navigate = useNavigate();

  const onSuccess = (data) => {
    const { token } = data?.data;
    localStorage.setItem("token", token);
    navigate("/");
  };

  const onError = (error) => {
    //Show global error message
    const { data, status } = error?.response;
    if (status === 404) {
      setUserNotExistsError(data?.message);
      setIncorrectCred(false);
    } else if (status === 401) {
      setIncorrectCred(data?.message);
      setUserNotExistsError(false);
    }
  };

  const { mutate, isLoading: postLoading } = useLoginUser(onSuccess, onError);

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
  return (
    <div className="login-page">
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
          <div style={{ color: "red" }}>{errors?.email?.message}</div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            {...register("password", validations.password)}
          />
          <div style={{ color: "red" }}>{errors?.password?.message}</div>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default LoginPage;
