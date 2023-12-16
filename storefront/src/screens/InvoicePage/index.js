import React from "react";
import { useGetInvoiceById, useGetInvoices } from "../../api/invoice";
import { Table } from "react-bootstrap";
import InvoiceItems from "./InvoiceItems";
import { CxSpinner } from "../../components";

const InvoicePage = () => {
  const { data: invoicesData, isLoading: isInvoicesLoading } =
    useGetInvoices(0);

  const openInvoiceInNewtab = (data) => {
    openPDFInNewTab(data?.data?.invoicePDF);
  };

  const openPDFInNewTab = (base64PDF) => {
    const byteCharacters = atob(base64PDF);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const pdfUrl = window.URL.createObjectURL(blob);

    window.open(pdfUrl, "_blank");
  };

  const { isLoading: isAddToCartLoading, mutate: fetchInvoicePdf } =
    useGetInvoiceById(openInvoiceInNewtab);

  const viewInvoice = (invoiceId) => {
    fetchInvoicePdf({
      isSingleInvoice: true,
      invoiceNumbers: [invoiceId],
    });
  };

  return isInvoicesLoading || isAddToCartLoading ? (
    <CxSpinner />
  ) : (
    <div className="container">
      <div className="d-flex">
        <div style={{ flexBasis: "25%" }} className="p-4">
          Date Range Facets
        </div>
        <div style={{ flexBasis: "75%" }} className="p-4">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th></th>
                <th>Invoice Name</th>
                <th>Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {invoicesData?.data?.invoices?.map((invoice) => {
                return (
                  <InvoiceItems
                    key={invoice?._id}
                    viewInvoice={viewInvoice}
                    {...invoice}
                  />
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
