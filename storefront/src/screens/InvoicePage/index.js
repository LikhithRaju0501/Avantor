import React, { useState } from "react";
import { useGetInvoiceById, useGetInvoices } from "../../api/invoice";
import { Button, Table } from "react-bootstrap";
import InvoiceItems from "./InvoiceItems";
import { CxSpinner } from "../../components";
import { downloadFilesAsZip, openPDFInNewTab } from "./InvoiceService";
import { useGlobalMessage } from "../../components/GlobalMessageService/GlobalMessageService";

const InvoicePage = () => {
  const [invoicesToDownload, setInvoicesToDownload] = useState(new Set());
  const { addMessage } = useGlobalMessage();
  const { data: invoicesData, isLoading: isInvoicesLoading } =
    useGetInvoices(0);

  const openInvoiceInNewtab = (data) => {
    if (data?.data?.isSingleInvoice) {
      openPDFInNewTab(data?.data?.invoicePDF);
    } else {
      addMessage("Please hold on a sec until we get you your ZIP file", "info");
      downloadFilesAsZip(data?.data?.invoices);
    }
  };

  const { isLoading: isGettingInvoiceLoading, mutate: fetchInvoicePdf } =
    useGetInvoiceById(openInvoiceInNewtab);

  const viewInvoice = (invoiceId) => {
    fetchInvoicePdf({
      isSingleInvoice: true,
      invoiceNumbers: [invoiceId],
    });
  };

  const downloadInvoices = () => {
    if (!Array.from(invoicesToDownload)?.length) {
      addMessage("Please Select Invoices to Download", "error");
      return;
    }
    fetchInvoicePdf({
      isSingleInvoice: false,
      invoiceNumbers: Array.from(invoicesToDownload),
    });
  };

  const addItemToInvoiceDownload = ({ invoiceId, isToBeAdded }) => {
    if (isToBeAdded) {
      let updatedSet = new Set(invoicesToDownload);
      updatedSet.add(invoiceId);
      setInvoicesToDownload(updatedSet);
    } else {
      let updatedSet = new Set(invoicesToDownload);
      updatedSet.delete(invoiceId);
      setInvoicesToDownload(updatedSet);
    }
  };

  return isInvoicesLoading || isGettingInvoiceLoading ? (
    <CxSpinner />
  ) : (
    <div className="container">
      <div className="p-4">
        <div className="d-flex justify-content-end">
          <Button className="mb-3" onClick={downloadInvoices}>
            Download Invoices ZIP
          </Button>
        </div>
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
                  addItemToInvoiceDownload={addItemToInvoiceDownload}
                  {...invoice}
                />
              );
            })}
          </tbody>
        </Table>
        <div className="d-flex justify-content-end">
          <Button onClick={downloadInvoices}>Download Invoices ZIP</Button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
