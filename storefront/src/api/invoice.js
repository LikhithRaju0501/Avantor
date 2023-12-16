import { useMutation, useQuery } from "react-query";
import { constants } from "./apiUrls";
import { axiosInstance } from "./interceptor";

const fetchInvoices = (currentPage) => {
  return axiosInstance.get(
    `${constants.baseSiteId}invoice?currentPage=${currentPage}`,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

export const useGetInvoices = (currentPage = 0) => {
  return useQuery(["invoices", currentPage], () => fetchInvoices(currentPage), {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};

const fetchInvoiceById = (params) => {
  return axiosInstance.post(
    `${constants.baseSiteId}invoice/get-invoice`,
    { ...params },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

export const useGetInvoiceById = (openInvoiceInNewtab) => {
  return useMutation(["invoices"], fetchInvoiceById, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: openInvoiceInNewtab,
  });
};
