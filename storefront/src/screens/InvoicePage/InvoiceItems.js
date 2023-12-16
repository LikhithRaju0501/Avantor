import React from "react";

const InvoiceItems = ({
  _id,
  name,
  paymentDate,
  viewInvoice,
  addItemToInvoiceDownload,
}) => {
  const handleAddInvoiceToDownload = (event) => {
    addItemToInvoiceDownload({
      invoiceId: _id,
      isToBeAdded: event?.target?.checked,
    });
  };
  return (
    <tr>
      <td>
        <input type="checkbox" onChange={handleAddInvoiceToDownload} />
      </td>
      <td>
        <a
          style={{ cursor: "pointer" }}
          className="cx-link"
          onClick={() => viewInvoice(_id)}
        >
          {name}
        </a>
      </td>
      <td>{new Date(paymentDate)?.toLocaleDateString()}</td>
    </tr>
  );
};

export default InvoiceItems;
