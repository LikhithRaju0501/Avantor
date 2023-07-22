import React, { useState } from "react";
import "./index.css";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";
import { useRegisterUser } from "../../api/register";

const RegisterPage = () => {
  const [UserExistsError, setUserExistsError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  let navigate = useNavigate();

  const onSuccess = () => navigate("/login");

  const onError = (error) => {
    if (error?.response?.status === 403) {
      setUserExistsError(error?.response?.data?.message);
    } else {
      //Need to show global error message
      setUserExistsError(false);
    }
  };
  const { mutate, isLoading: postLoading } = useRegisterUser(
    onSuccess,
    onError
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
  };

  const formSubmit = (data) => {
    mutate(data);
  };

  return (
    <div className="register-page">
      {UserExistsError && <Alert variant={"warning"}>{UserExistsError}</Alert>}
      <Form onSubmit={handleSubmit(formSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            {...register("username", validations.username)}
          />
          <div style={{ color: "red" }}>{errors?.username?.message}</div>
        </Form.Group>

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

export default RegisterPage;
