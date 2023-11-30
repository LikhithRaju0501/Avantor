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
  navigateToCheckoutSuccess,
  navigateToCheckoutError
) => {
  return useQuery(
    ["checkout", stepIndex],
    () => navigateToCheckoutStep(stepIndex),
    {
      enabled: false,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onSuccess: navigateToCheckoutSuccess,
      onError: navigateToCheckoutError,
    }
  );
};
