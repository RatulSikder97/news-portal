import { API_BASE_URL, API_ENDPOINTS } from "../config/api";
import type { News } from "../types";

export const newsService = {
  async getAllNews(): Promise<News[]> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.news}`);
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching news:", error);
      throw error;
    }
  },

  async getNewsById(id: number): Promise<News> {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.news}/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching news:", error);
      throw error;
    }
  },

  async createNews(newsData: Omit<News, "id" | "comments">): Promise<News> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.news}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newsData, comments: [] }),
      });
      if (!response.ok) {
        throw new Error("Failed to create news");
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating news:", error);
      throw error;
    }
  },

  async updateNews(id: number, newsData: Partial<News>): Promise<News> {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.news}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newsData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update news");
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating news:", error);
      throw error;
    }
  },

  async deleteNews(id: number): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.news}/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete news");
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      throw error;
    }
  },
};
