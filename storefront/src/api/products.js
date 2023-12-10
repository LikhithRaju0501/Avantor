import axios from "axios";
import { useMutation, useQuery } from "react-query";
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

const fetchProductSuggestions = (searchTerm) => {
  return axios.post(`${constants.baseSiteId}search/suggestions`, {
    searchTerm,
  });
};
const debounce = (func, delay) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const useGetProductSuggestions = () => {
  const mutation = useMutation((searchTerm) =>
    fetchProductSuggestions(searchTerm)
  );

  const delayedMutate = debounce(mutation.mutate, 1500);

  return {
    ...mutation,
    delayedMutate,
  };
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
