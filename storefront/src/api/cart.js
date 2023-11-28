import { useMutation, useQuery } from "react-query";
import { constants } from "./apiUrls";
import { axiosInstance } from "./interceptor";

const fetchCartDetails = () => {
  return axiosInstance.get(`${constants.baseSiteId}cart`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
};

export const useGetCartDetails = (onGetCartError) => {
  return useQuery(["cart"], () => fetchCartDetails(), {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onError: onGetCartError,
  });
};

const fetchAddToCart = (params) => {
  return axiosInstance.post(
    `${constants.baseSiteId}cart`,
    { ...params },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

export const useAddToCart = (onAddToCartSuccess, addToCartFailure) => {
  return useMutation(["cart"], fetchAddToCart, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: onAddToCartSuccess,
    onError: addToCartFailure,
  });
};

const deleteCartDetail = (productId) => {
  return axiosInstance.delete(`${constants.baseSiteId}cart`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
    data: { productId },
  });
};

export const useDeleteCartDetail = (onDeleteSuccess, onDeleteError) => {
  return useMutation(["cart"], deleteCartDetail, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: onDeleteSuccess,
    onError: onDeleteError,
  });
};
