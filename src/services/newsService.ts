import { API_BASE_URL, API_ENDPOINTS } from "../config/api";
import {
  ERROR_CREATE_NEWS,
  ERROR_DELETE_NEWS,
  ERROR_LOAD_NEWS,
  ERROR_LOAD_NEWS_DETAIL,
  ERROR_LOAD_USERS,
  ERROR_UPDATE_NEWS,
} from "../config/constants";
import type { News, PaginatedResponse } from "../types";

const endpoints = {
  getAll: `${API_BASE_URL}${API_ENDPOINTS.news}`,
  getById: (id: number) => `${API_BASE_URL}${API_ENDPOINTS.news}/${id}`,
  create: `${API_BASE_URL}${API_ENDPOINTS.news}`,
  update: (id: number) => `${API_BASE_URL}${API_ENDPOINTS.news}/${id}`,
  delete: (id: number) => `${API_BASE_URL}${API_ENDPOINTS.news}/${id}`,
};

export const newsService = {
  async getAllNews(
    page: number = 1,
    limit: number = 10,
    query?: string
  ): Promise<PaginatedResponse<News>> {
    try {
      const url = endpoints.getAll;
      const params = new URLSearchParams();

      params.append("_page", page.toString());
      params.append("_limit", limit.toString());

      if (query) {
        params.append("q", encodeURIComponent(query));
      }

      params.append("_sort", "id");
      params.append("_order", "desc");

      const response = await fetch(`${url}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(ERROR_LOAD_NEWS);
      }

      const data = await response.json();

      // Get total count from Link header or X-Total-Count
      const totalCount = parseInt(response.headers.get("X-Total-Count") || "0");
      const totalPages = Math.ceil(totalCount / limit);

      const paginatedResponse: PaginatedResponse<News> = {
        first: 1,
        prev: page > 1 ? page - 1 : null,
        next: page < totalPages ? page + 1 : null,
        last: totalPages,
        pages: totalPages,
        items: totalCount,
        data: data,
      };

      return paginatedResponse;
    } catch (error) {
      console.error(ERROR_LOAD_NEWS, error);
      throw error;
    }
  },

  async getNewsById(id: number): Promise<News> {
    try {
      const response = await fetch(`${endpoints.getById(+id)}`);
      if (!response.ok) {
        throw new Error(ERROR_LOAD_NEWS_DETAIL);
      }

      const news = await response.json();

      const author = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.users}/${news.author_id}`
      );
      if (!author.ok) {
        throw new Error(ERROR_LOAD_USERS);
      }
      news.author = await author.json();
      return news;
    } catch (error) {
      console.error(ERROR_LOAD_NEWS_DETAIL, error);
      throw error;
    }
  },

  async createNews(newsData: Omit<News, "id" | "comments">): Promise<News> {
    try {
      const response = await fetch(`${endpoints.create}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newsData, comments: [] }),
      });

      if (!response.ok) {
        throw new Error(ERROR_CREATE_NEWS);
      }
      return await response.json();
    } catch (error) {
      console.error(ERROR_CREATE_NEWS, error);
      throw error;
    }
  },

  async updateNews(id: number, newsData: Partial<News>): Promise<News> {
    try {
      const response = await fetch(`${endpoints.update(id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newsData),
      });
      if (!response.ok) {
        throw new Error(ERROR_UPDATE_NEWS);
      }
      return await response.json();
    } catch (error) {
      console.error(ERROR_UPDATE_NEWS, error);
      throw error;
    }
  },

  async deleteNews(id: number): Promise<void> {
    try {
      const response = await fetch(`${endpoints.delete(id)}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(ERROR_DELETE_NEWS);
      }
    } catch (error) {
      console.error(ERROR_DELETE_NEWS, error);
      throw error;
    }
  },
};
