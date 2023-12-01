import { useMutation, useQuery } from "react-query";
import { constants } from "./apiUrls";
import { axiosInstance } from "./interceptor";

const navigateToCheckoutStep = (stepIndex) => {
  return axiosInstance.get(`${constants.baseSiteId}checkout/${stepIndex}`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

export const useGetNavigateToCheckoutStep = (
  stepIndex,
  isFetchByDefault,
  navigateToCheckoutSuccess,
  navigateToCheckoutError
) => {
  return useQuery(
    ["checkout", stepIndex],
    () => navigateToCheckoutStep(stepIndex),
    {
      enabled: isFetchByDefault,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onSuccess: navigateToCheckoutSuccess,
      onError: navigateToCheckoutError,
    }
  );
};

const updateDeliveryAddress = (addressId) => {
  return axiosInstance.put(
    `${constants.baseSiteId}checkout/updateCartAddress`,
    { addressId },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

export const useUpdateDeliveryAddress = (onUpdateDeliveryAddressSuccess) => {
  return useMutation(["checkout"], updateDeliveryAddress, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: onUpdateDeliveryAddressSuccess,
  });
};

const addEmailAddress = (email) => {
  return axiosInstance.post(
    `${constants.baseSiteId}checkout/addEmailAddress`,
    { email },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

export const useAddEmailAddress = (
  onAddEmailAddressSuccess,
  onAddEmailAddressError
) => {
  return useMutation(["checkout"], addEmailAddress, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: onAddEmailAddressSuccess,
    onError: onAddEmailAddressError,
  });
};

const removeEmailAddress = (email) => {
  return axiosInstance.delete(
    `${constants.baseSiteId}checkout/removeEmailAddress`,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      data: { email },
    }
  );
};

export const useRemoveEmailAddress = (
  onDeleteEmailSuccess,
  onRemoveEmailAddressError
) => {
  return useMutation(["checkout"], removeEmailAddress, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: onDeleteEmailSuccess,
    onError: onRemoveEmailAddressError,
  });
};
