import { API_BASE_URL, API_ENDPOINTS } from "../config/api";
import { ERROR_LOAD_USERS } from "../config/constants";
import type { User } from "../types";

export const userService = {
  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users}`);
      if (!response.ok) {
        throw new Error(ERROR_LOAD_USERS);
      }
      return (await response.json()) as User[];
    } catch (error) {
      console.error(ERROR_LOAD_USERS, error);
      throw error;
    }
  },

  async getUserById(id: number): Promise<User> {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.users}/${id}`
      );
      if (!response.ok) {
        throw new Error(ERROR_LOAD_USERS);
      }
      return await response.json();
    } catch (error) {
      console.error(ERROR_LOAD_USERS, error);
      throw error;
    }
  },
};
