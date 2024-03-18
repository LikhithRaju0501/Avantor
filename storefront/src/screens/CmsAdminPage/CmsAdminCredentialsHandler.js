import React from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

const CmsAdminCredentialsHandler = ({
  createCMSPage,
  CMSPageURL,
  CMSComponentRequest,
  ...rest
}) => {
  const validations = {
    name: { required: "Name is required" },
    safeWord: {
      required: "Password is required",
    },
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const formSubmit = (data) => {
    const CMSPayload = {
      user: {
        ...data,
      },
      pathname: CMSPageURL,
      component: {
        ...CMSComponentRequest,
      },
    };
    createCMSPage(CMSPayload);
  };

  return (
    <Form onSubmit={handleSubmit(formSubmit)}>
      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          placeholder="Enter name"
          autoComplete="off"
          {...register("name", validations.name)}
        />
        <div className="text-danger small">{errors?.name?.message}</div>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          autoComplete="off"
          {...register("safeWord", validations.safeWord)}
        />
        <div className="text-danger small">{errors?.safeWord?.message}</div>
      </Form.Group>
      <Button variant="success" type="submit" className="w-100 mb-2">
        Create
      </Button>
      <Button
        variant="outline-dark"
        className="w-100 mb-2"
        onClick={() => setCurrentStep(3)}
      >
        Back
      </Button>
    </Form>
  );
};

export default CmsAdminCredentialsHandler;
