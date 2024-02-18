import axios from "axios";
import { useQuery } from "react-query";
import { constants } from "./apiUrls";

const fetchPage = (pathname) => {
  return axios.post(`${constants.baseSiteId}pages`, {
    pathname,
  });
};

export const useGetPage = (pathname) => {
  return useQuery(["pages", pathname], () => fetchPage(pathname), {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
