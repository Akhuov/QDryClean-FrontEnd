import axiosInstance from "@/shared/api/axiosInstance";

// Получить всех пользователей
export async function getAllUsers() {
  const response = await axiosInstance.get("/users");
  return response.data;
}