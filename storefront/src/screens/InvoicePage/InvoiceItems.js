import React from "react";

const InvoiceItems = ({ _id, name, paymentDate, viewInvoice }) => {
  return (
    <tr>
      <td>
        <input type="checkbox" />
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
