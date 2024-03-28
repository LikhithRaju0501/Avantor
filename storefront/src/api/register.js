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

const resetPassword = (data) => {
  return axios.post(`${constants.baseSiteId}reset-password`, data);
};

export const useResetPassword = (onSuccess, onError) => {
  return useMutation(resetPassword, {
    onSuccess,
    onError,
  });
};

const resetPasswordEmail = (data) => {
  return axios.post(`${constants.baseSiteId}reset-password/email`, data);
};

export const useResetPasswordEmail = (onSuccess, onError) => {
  return useMutation(resetPasswordEmail, {
    onSuccess,
    onError,
  });
};

export const isLoggedIn = () => {
  return Boolean(localStorage.getItem("token"));
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
