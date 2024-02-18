import React from "react";
import { Button } from "react-bootstrap";

const CxParagraph = ({ title, description, isButton, buttonTitle }) => {
  return (
    <div className="container mb-5">
      <h2>{title}</h2>
      <div dangerouslySetInnerHTML={{ __html: description }} />
      {isButton && <Button>{buttonTitle}</Button>}
    </div>
  );
};

export default CxParagraph;
