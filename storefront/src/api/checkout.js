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
  navigateToCheckout,
  navigateToCheckoutError
) => {
  return useQuery(
    ["checkout", stepIndex],
    () => navigateToCheckoutStep(stepIndex),
    {
      enabled: false,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onSuccess: navigateToCheckout,
      onError: navigateToCheckoutError,
    }
  );
};
