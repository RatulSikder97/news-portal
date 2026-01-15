export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

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
