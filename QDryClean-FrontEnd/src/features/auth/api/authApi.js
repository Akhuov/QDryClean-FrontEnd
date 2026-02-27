import axiosInstance from "../../../shared/api/axiosInstance";

// Функция логина
export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth", {
      logIn: credentials.login,
      password: credentials.password
    });
    console.log('Login response:', response.data);
    return response.data; // { token, user }
  } catch (error) {
    console.error('Auth API error:', error.response?.data || error.message);
    throw error; // Пробрасываем ошибку для обработки в компоненте
  }
};
