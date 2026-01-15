import { API_ENDPOINTS } from "../config/api";
import { ERROR_LOAD_USERS } from "../config/constants";
import type { User, LoginCredentials, RegisterData } from "../types";
import apiClient from "../api/client";

export const userService = {
  async getUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.users);
      return response.data.data;
    } catch (error) {
      console.error(ERROR_LOAD_USERS, error);
      throw error;
    }
  },

  async getUserById(id: string): Promise<User> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.users}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(ERROR_LOAD_USERS, error);
      throw error;
    }
  },

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.auth.login, credentials);
      const userData = response.data.data;
      if (userData.user && userData.user.id && !userData.user._id) {
        userData.user._id = userData.user.id;
      }
      return userData;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  },

  async register(data: RegisterData): Promise<User> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.auth.register, data);
      const user = response.data.data;
      if (user && user.id && !user._id) {
        user._id = user.id;
      }
      return user;
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  },

  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.auth.profile);
      const user = response.data.data;
      if (user && user.id && !user._id) {
        user._id = user.id;
      }
      return user;
    } catch (error) {
      console.error("Failed to fetch profile", error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
      // We might not want to throw here, just ensure client state is cleared
    }
  },
};
