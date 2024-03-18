import React from "react";

import { Button, Form, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";

const CmsAdminPageURLHandler = ({ pageURLFormSubmit }) => {
  const { register: registerPageURL, handleSubmit: handlePageURLSubmit } =
    useForm();
  return (
    <Form onSubmit={handlePageURLSubmit(pageURLFormSubmit)}>
      <Form.Label htmlFor="basic-url">CMS Page URL</Form.Label>
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">/</InputGroup.Text>
        <Form.Control
          aria-label="CMS Page URL"
          aria-describedby="basic-addon1"
          {...registerPageURL("pageURL")}
        />
      </InputGroup>
      <Button type="submit" className="w-100">
        Next
      </Button>
    </Form>
  );
};

export default CmsAdminPageURLHandler;
