import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8090";

const getAuthHeaders = () => {
  const authData = JSON.parse(localStorage.getItem("smart-campus-auth") || "{}");
  const token = authData?.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const userApi = {
  // Get users by role (ADMIN only)
  getUsersByRole: async (role) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/users/role/${role}`,
      getAuthHeaders()
    );
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/users/${userId}`,
      getAuthHeaders()
    );
    return response.data;
  },
};
