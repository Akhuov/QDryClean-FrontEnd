import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is not configured");
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

let navigateToLogin = null;

export const setNavigateFunction = (navigateFn) => {
  navigateToLogin = navigateFn;
};

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.code = "NETWORK_ERROR";
    }

    if (error.response?.status === 401 || error.response?.data?.code === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const currentPath = window.location.pathname;
      if (currentPath !== "/login") {
        if (navigateToLogin) {
          navigateToLogin("/login");
        } else {
          window.location.replace("/login");
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;