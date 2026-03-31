import axios from "axios";

// Используем прокси для разработки, прямой URL для продакшена
const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Создаем экземпляр axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 секунд таймаут
});

// Функция для перенаправления на логин (будет установлена из React)
let navigateToLogin = null;

// Экспортируем функцию для установки навигации из React компонентов
export const setNavigateFunction = (navigateFn) => {
  navigateToLogin = navigateFn;
};

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
    
    // Если получили 401 (Unauthorized) или AuthExpiry - перенаправляем на логин
    if (error.response?.status === 401 || error.response?.data?.code === 401) {
      // Очищаем данные аутентификации
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Перенаправляем на страницу логина
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        // Используем React Router навигацию если доступна, иначе fallback
        if (navigateToLogin) {
          navigateToLogin('/login');
        } else {
          // Fallback: используем replace чтобы не добавлять в историю
          window.location.replace('/login');
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;