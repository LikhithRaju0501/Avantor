import { useMutation, useQuery } from "react-query";
import { constants } from "./apiUrls";
import { axiosInstance } from "./interceptor";

const fetchShippingOptions = () => {
  return axiosInstance.get(`${constants.baseSiteId}shipping-options`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

export const useGetShippingOptions = () => {
  return useQuery(["shipping-options"], fetchShippingOptions, {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};

const addShippingOption = (address) => {
  return axiosInstance.post(
    `${constants.baseSiteId}shipping-options`,
    { ...address },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

export const useAddShippingOption = (onAddShippingOptionSuccess) => {
  return useMutation(["shipping-options"], addShippingOption, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: onAddShippingOptionSuccess,
  });
};

const makeDefaultShippingOption = (addressId) => {
  return axiosInstance.put(
    `${constants.baseSiteId}shipping-options/make-default`,
    { addressId },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

export const useMakeDefaultShippingOption = (onMakeDefaultAddressSuccesss) => {
  return useMutation(["shipping-options"], makeDefaultShippingOption, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: onMakeDefaultAddressSuccesss,
  });
};

const deleteShippingOption = (addressId) => {
  return axiosInstance.delete(`${constants.baseSiteId}shipping-options`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
    data: { addressId },
  });
};

export const useDeleteShippingOption = (onDeleteSuccess) => {
  return useMutation(["shipping-options"], deleteShippingOption, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: onDeleteSuccess,
  });
};
