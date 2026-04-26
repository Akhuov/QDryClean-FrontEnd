// features/auth/api/authApi.js

import axiosInstance from "../../../shared/api/axiosInstance";

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth", {
      logIn: credentials.login,
      password: credentials.password
    });

    // Expected backend response: { code: 0, message: "Success", response: { token: "JWT_TOKEN", role: "Admin" } }
    return response.data.response;

  } catch (error) {
    console.error('Auth API error:', error.response?.data || error.message);
    throw error;
  }
};