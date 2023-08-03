import axios from "axios";
import { useQuery } from "react-query";
import { constants } from "./apiUrls";

const fetchCartDetails = () => {
  return axios.get(`${constants.baseSiteId}cart`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

export const useGetCartDetails = () => {
  return useQuery(["cart"], () => fetchCartDetails(), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
