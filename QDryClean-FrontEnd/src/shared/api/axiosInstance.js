import axios from "axios";

// Используем прокси для разработки, прямой URL для продакшена
const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Создаем экземпляр axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 секунд таймаут
});

// Добавляем интерцептор для подстановки токена
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // токен сохраняется после логина
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Добавляем интерцептор для обработки ошибок ответов
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Добавляем код ошибки для удобной обработки
    if (!error.response) {
      error.code = 'NETWORK_ERROR';
    }
    
    // Если получили 401 (Unauthorized), но только если есть токен (истекшая сессия)
    if (error.response?.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;