import React, { useState } from "react";
import { Button } from "react-bootstrap";
import OrderItemsModal from "./OrderItemsModal";

const OrderItems = ({ order }) => {
  const [showModal, setShowModal] = useState(false);
  const { _id, createdAt, numberOfItems, orderStatus, subTotalPrice, entries } =
    order;

  return (
    <tr>
      <td>{_id}</td>
      <td>{new Date(createdAt).toLocaleDateString()}</td>
      <td>{numberOfItems}</td>
      <td>{orderStatus}</td>
      <td> {subTotalPrice?.formattedValue}</td>
      <td>
        <Button onClick={() => setShowModal(true)}>View</Button>
        <OrderItemsModal
          entries={entries}
          subTotalPrice={subTotalPrice}
          show={showModal}
          onHide={() => setShowModal(false)}
        />
      </td>
    </tr>
  );
};

export default OrderItems;
