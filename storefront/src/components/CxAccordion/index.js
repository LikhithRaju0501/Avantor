import React from "react";
import { Accordion } from "react-bootstrap";

const CxAccordion = ({ title, accordionItems }) => {
  return (
    <div className="container mb-5">
      <h2>{title}</h2>
      <Accordion>
        {accordionItems?.map(({ _id, title: accordionTitle, description }) => {
          return (
            <Accordion.Item key={_id} eventKey={_id}>
              <Accordion.Header>{accordionTitle}</Accordion.Header>
              <Accordion.Body
                dangerouslySetInnerHTML={{ __html: description }}
              ></Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </div>
  );
};

export default CxAccordion;
