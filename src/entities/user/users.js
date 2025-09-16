import axios from "axios";

const API_URL = "https://localhost:5001/api";

export async function getAllUsers(token) {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`, // токен пользователя
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    throw error;
  }
}