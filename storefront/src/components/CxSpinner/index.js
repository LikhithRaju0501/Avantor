import React from "react";
import { Spinner } from "react-bootstrap";
import "./index.css";

const CxSpinner = ({ variant = "light", pageLevelSpinner = true }) => {
  return pageLevelSpinner ? (
    <div className="overlay d-flex flex-column">
      <Spinner animation="border" role="status" variant={variant} />
      <div className="loading-header mt-2">Loading...</div>
    </div>
  ) : (
    <>
      <Spinner animation="border" role="status" variant="dark" />
      <div className="mt-2">Loading...</div>
    </>
  );
};

export default CxSpinner;
