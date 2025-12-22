import axios from "@/shared/api/axiosInstance";

// Получить всех пользователей
export async function getAllUsers() {
  const response = await axios.get("/users");
  return response.data;
}