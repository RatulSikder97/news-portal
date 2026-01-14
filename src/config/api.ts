export const API_BASE_URL = "http://localhost:3000";

export const API_ENDPOINTS = {
  users: "/users",
  news: "/news",
  comments: "/comments",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    profile: "/auth/profile",
  },
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
