import axios from "axios";
import { useMutation, useQuery } from "react-query";
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
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};

const fetchAddToCart = (params) => {
  return axios.post(
    `${constants.baseSiteId}cart`,
    { ...params },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

export const useAddToCart = (onAddToCartSuccess) => {
  return useMutation(["cart"], fetchAddToCart, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: onAddToCartSuccess,
  });
};

const deleteCartDetail = (productId) => {
  return axios.delete(`${constants.baseSiteId}cart`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
    data: { productId },
  });
};

export const useDeleteCartDetail = (onDeleteSuccess) => {
  return useMutation(["cart"], deleteCartDetail, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: onDeleteSuccess,
  });
};
