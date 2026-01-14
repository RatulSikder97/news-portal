import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from "../config/api";
import { ERROR_LOAD_USERS } from "../config/constants";
import type { User, LoginCredentials, RegisterData, AuthResponse } from "../types";

export const userService = {
  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(ERROR_LOAD_USERS);
      }
      const json = await response.json();
      return json.data;
    } catch (error) {
      console.error(ERROR_LOAD_USERS, error);
      throw error;
    }
  },

  async getUserById(id: number): Promise<User> {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.users}/${id}`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error(ERROR_LOAD_USERS);
      }
      const json = await response.json();
      return json.data;
    } catch (error) {
      console.error(ERROR_LOAD_USERS, error);
      throw error;
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.login}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }
      return await response.json();
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  },

  async register(data: RegisterData): Promise<User> {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.auth.register}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }
      const json = await response.json();
      return json.data;
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  },

  async getProfile(): Promise<User> {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.auth.profile}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const json = await response.json();
      return json.data;
    } catch (error) {
      console.error("Failed to fetch profile", error);
      throw error;
    }
  },
};

