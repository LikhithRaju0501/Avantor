import React, { useState } from "react";
import { Button } from "react-bootstrap";
import OrderItemsModal from "./OrderItemsModal";

const OrderItems = ({ order }) => {
  const [showModal, setShowModal] = useState(false);
  const { _id, createdAt, numberOfItems, orderStatus, totalPrice, entries } =
    order;

  return (
    <li
      key={_id}
      style={{
        borderRadius: "3px",
        padding: "25px 30px",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "25px",
        backgroundColor: "#ffffff",
        boxShadow: "0px 0px 9px 0px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ flexBasis: "20%" }} className="text-break p-2">
        {_id}
      </div>
      <div style={{ flexBasis: "20%" }} className="text-break p-2">
        {new Date(createdAt).toLocaleDateString()}
      </div>
      <div style={{ flexBasis: "10%" }} className="text-break p-2">
        {numberOfItems}
      </div>
      <div style={{ flexBasis: "20%" }} className="text-break p-2">
        {orderStatus}
      </div>
      <div style={{ flexBasis: "20%" }} className="text-break p-2">
        {totalPrice?.formattedValue}
      </div>
      <div style={{ flexBasis: "10%" }} className="text-break p-2">
        <Button onClick={() => setShowModal(true)}>View</Button>
        <OrderItemsModal
          entries={entries}
          totalPrice={totalPrice}
          show={showModal}
          onHide={() => setShowModal(false)}
        />
      </div>
    </li>
  );
};

export default OrderItems;
