import { axiosInstance } from "./interceptor";
import { useQuery } from "react-query";
import { constants } from "./apiUrls";

const fetchUserDetails = () => {
  return axiosInstance.get(`${constants.baseSiteId}user`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

export const useUserDetails = () => {
  return useQuery(["user"], () => fetchUserDetails(), {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
