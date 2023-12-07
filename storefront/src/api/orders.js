import { useMutation, useQuery } from "react-query";
import { constants } from "./apiUrls";
import { axiosInstance } from "./interceptor";

const fetchOrders = (currentPage) => {
  return axiosInstance.get(
    `${constants.baseSiteId}orders?currentPage=${currentPage}`,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

export const useGetOrders = (currentPage) => {
  return useQuery(["orders", currentPage], () => fetchOrders(currentPage), {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};

const placeOrder = () => {
  return axiosInstance.post(
    `${constants.baseSiteId}orders`,
    {},
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

export const usePlaceOrder = (onPlaceOrderSuccess, onPlaceOrderError) => {
  return useMutation(["order"], placeOrder, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: onPlaceOrderSuccess,
    onError: onPlaceOrderError,
  });
};
