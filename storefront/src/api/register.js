import axios from "axios";
import { useMutation } from "react-query";
import { constants } from "./apiUrls";

const registerUser = (data) => {
  return axios.post(`${constants.baseSiteId}register`, data);
};

export const useRegisterUser = (onSuccess, onError) => {
  return useMutation(registerUser, {
    onSuccess,
    onError,
  });
};

const loginUser = (data) => {
  return axios.post(`${constants.baseSiteId}login`, data);
};

export const useLoginUser = (onSuccess, onError) => {
  return useMutation(loginUser, {
    onSuccess,
    onError,
  });
};

export const isLoggedIn = () => {
  return Boolean(localStorage.getItem("token"));
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.reload();
};
