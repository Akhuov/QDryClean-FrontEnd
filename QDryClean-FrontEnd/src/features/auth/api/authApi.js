import axiosInstance from "@/shared/api/axiosInstance";

// Функция логина
export const loginUser = async (credentials) => {
  const response = await axiosInstance.post("/Auth", credentials);
  return response.data; // { token, user }
};
