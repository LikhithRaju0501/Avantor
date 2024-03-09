import axios from "axios";
import { useQuery } from "react-query";
import { constants } from "./apiUrls";
import { axiosInstance } from "./interceptor";

const fetchPage = (pathname) => {
  return axiosInstance.post(
    `${constants.baseSiteId}pages`,
    {
      pathname,
    },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

export const useGetPage = (pathname) => {
  return useQuery(["pages", pathname], () => fetchPage(pathname), {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
