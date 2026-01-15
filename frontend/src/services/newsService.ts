import { API_ENDPOINTS } from "../config/api";
import {
  ERROR_CREATE_NEWS,
  ERROR_DELETE_NEWS,
  ERROR_LOAD_NEWS,
  ERROR_LOAD_NEWS_DETAIL,
  ERROR_UPDATE_NEWS,
  ERROR_POST_COMMENT,
} from "../config/constants";
import type { News, PaginatedResponse } from "../types";
import apiClient from "../api/client";

export const newsService = {
  async getAllNews(
    page: number = 1,
    limit: number = 10,
    query?: string
  ): Promise<PaginatedResponse<News>> {
    try {
      const params: Record<string, any> = {
        _page: page,
        _limit: limit,
        _sort: "_id",
        _order: "desc",
      };

      if (query) {
        params.q = query;
      }

      const response = await apiClient.get(API_ENDPOINTS.news, { params });

      const data = response.data.data;
      const totalCount = parseInt(response.headers["x-total-count"] || "0");
      const totalPages = Math.ceil(totalCount / limit);

      return {
        first: 1,
        prev: page > 1 ? page - 1 : null,
        next: page < totalPages ? page + 1 : null,
        last: totalPages,
        pages: totalPages,
        items: totalCount,
        data: data,
      };
    } catch (error) {
      console.error(ERROR_LOAD_NEWS, error);
      throw error;
    }
  },

  async getNewsById(id: string): Promise<News> {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.news}/${id}`);
      const news = response.data.data;

      // Author population logic
      if (news.author_id && typeof news.author_id === 'string') {
        try {
          const authorResponse = await apiClient.get(
            `${API_ENDPOINTS.users}/${news.author_id}`
          );
          news.author = authorResponse.data.data;
        } catch (e) {
          // Ignore author fetch error, just return news without populated author
          console.warn("Failed to fetch author for news detail", e);
        }
      }

      return news;
    } catch (error) {
      console.error(ERROR_LOAD_NEWS_DETAIL, error);
      throw error;
    }
  },

  async createNews(newsData: Omit<News, "_id" | "comments" | "author_id" | "created_at">): Promise<News> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.news, newsData);
      return response.data.data;
    } catch (error) {
      console.error(ERROR_CREATE_NEWS, error);
      throw error;
    }
  },

  async updateNews(id: string, newsData: Partial<News>): Promise<News> {
    try {
      // Remove restricted fields
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, author_id, created_at, comments, ...updateData } = newsData as any;

      const response = await apiClient.patch(`${API_ENDPOINTS.news}/${id}`, updateData);
      return response.data.data;
    } catch (error) {
      console.error(ERROR_UPDATE_NEWS, error);
      throw error;
    }
  },

  async deleteNews(id: string): Promise<void> {
    try {
      await apiClient.delete(`${API_ENDPOINTS.news}/${id}`);
    } catch (error) {
      console.error(ERROR_DELETE_NEWS, error);
      throw error;
    }
  },

  async addComment(newsId: string, text: string): Promise<News> {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.news}/${newsId}/comments`,
        { text }
      );
      return response.data.data;
    } catch (error) {
      console.error(ERROR_POST_COMMENT, error);
      throw error;
    }
  },

  async removeComment(newsId: string, commentId: string): Promise<News> {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.news}/${newsId}/comments/${commentId}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to delete comment", error);
      throw error;
    }
  }
};
