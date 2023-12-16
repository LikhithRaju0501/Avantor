import JSZip from "jszip";
import { saveAs } from "file-saver";

export const openPDFInNewTab = (base64PDF) => {
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

export const downloadFilesAsZip = async (base64PDFs) => {
  const zip = new JSZip();

  base64PDFs.forEach(({ invoicePDF, name }) => {
    const pdfBlob = b64toBlob(invoicePDF, "application/pdf");

    zip.file(`${name}.pdf`, pdfBlob, { binary: true });
  });

  const content = await zip.generateAsync({ type: "blob" });

  saveAs(content, "Invoices.zip");
};

export const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};
