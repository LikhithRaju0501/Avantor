import { useMutation, useQuery } from "react-query";
import { constants } from "./apiUrls";
import { axiosInstance } from "./interceptor";

const fetchOrders = () => {
  return axiosInstance.get(`${constants.baseSiteId}orders`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

export const useGetOrders = () => {
  return useQuery(["orders"], () => fetchOrders(), {
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
