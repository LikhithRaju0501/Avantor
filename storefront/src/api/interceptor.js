import axios from "axios";
import { constants } from "./apiUrls";

export const axiosInstance = axios.create({
  baseURL: constants?.baseSiteId,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response && error?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
