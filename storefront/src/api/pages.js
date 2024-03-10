import { useMutation, useQuery } from "react-query";
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

export const useGetCMSPage = (onFetchPageSuccess, onFetchPageError) => {
  return useMutation(["pages"], fetchPage, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: onFetchPageSuccess,
    onError: onFetchPageError,
  });
};

const createPage = (payload) => {
  return axiosInstance.post(
    `${constants.baseSiteId}pages/add-page`,
    {
      ...payload,
    },
    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
};

export const useCreateCMSPage = (onCreatePageSuccess, onCreatePageError) => {
  return useMutation(["pages"], createPage, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: onCreatePageSuccess,
    onError: onCreatePageError,
  });
};
