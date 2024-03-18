import React from "react";
import { Button, Form } from "react-bootstrap";

const CmsAdminPageComponentTypeHandler = ({
  CMSPageData,
  CMSComponentType,
  setCMSComponentType,
  componentTypes,
  setCurrentStep,
}) => {
  return (
    <>
      <h3>Current Components:</h3>
      {CMSPageData?.length ? (
        CMSPageData?.map(({ _id, type, ...rest }) => (
          <div key={_id}>
            <Button variant="light" className="w-100 mb-2">
              {type}
            </Button>
          </div>
        ))
      ) : (
        <span className="text-center">Empty Page</span>
      )}
      <hr />
      <h4>Select Component Type: </h4>

      <Form.Select
        value={CMSComponentType}
        onChange={(event) => setCMSComponentType(event?.target?.value)}
        className="mt-3 mb-3 cursor-pointer"
      >
        {componentTypes?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Form.Select>
      <Button
        variant="secondary"
        className="w-100 mb-2"
        onClick={() => setCurrentStep(3)}
      >
        Add
      </Button>

      <Button
        variant="outline-dark"
        className="w-100 mb-2"
        onClick={() => setCurrentStep(1)}
      >
        Back
      </Button>
    </>
  );
};

export default CmsAdminPageComponentTypeHandler;
