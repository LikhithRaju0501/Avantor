import { useMutation, useQuery } from "react-query";
import { constants } from "./apiUrls";
import { axiosInstance } from "./interceptor";

const fetchOrders = (currentPage, sort, orderedDate) => {
  return axiosInstance.get(
    `${constants.baseSiteId}orders?currentPage=${currentPage}&sort=${sort}&orderedDate=${orderedDate}`,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

export const useGetOrders = (
  currentPage = 0,
  sort = "createdAt-desc",
  orderedDate = ""
) => {
  return useQuery(
    ["orders", currentPage, sort, orderedDate],
    () => fetchOrders(currentPage, sort, orderedDate),
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );
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
