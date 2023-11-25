import React from "react";
import { Spinner } from "react-bootstrap";
import "./index.css";

const CxSpinner = ({ variant = "light" }) => {
  return (
    <div className="overlay d-flex flex-column">
      <Spinner animation="border" role="status" variant={variant} />
      <div className="loading-header mt-2">Loading...</div>
    </div>
  );
};

export default CxSpinner;
