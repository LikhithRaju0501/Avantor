import axios from "axios";
import { useQuery } from "react-query";
import { constants } from "./apiUrls";

const fetchProducts = (searchTerm, currentPage) => {
  return axios.get(
    `${constants.baseSiteId}search/${searchTerm}?currentPage=${currentPage}`
  );
};

export const useGetProducts = (searchTerm, currentPage) => {
  return useQuery(
    ["products", searchTerm, currentPage],
    () => fetchProducts(searchTerm, currentPage),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
};

const fetchProductDetails = (productId) => {
  return axios.get(`${constants.baseSiteId}p/${productId}`);
};

export const useGetProductDetails = (productId) => {
  return useQuery(
    ["productDetails", productId],
    () => fetchProductDetails(productId),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
};
