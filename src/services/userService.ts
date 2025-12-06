import { API_BASE_URL, API_ENDPOINTS } from "../config/api";
import type { User } from "../types";

export const userService = {
  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  async getUserById(id: number): Promise<User> {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.users}/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },
};
