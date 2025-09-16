import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
// Создаем экземпляр axios
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Добавляем интерцептор для подстановки токена
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // токен сохраняется после логина
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;