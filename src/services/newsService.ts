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

      params.append("_sort", "created_at");
      params.append("_order", "desc");

      const response = await fetch(`${url}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(ERROR_LOAD_NEWS);
      }

      // json-server returns data as array in body, pagination info in headers
      const data: News[] = await response.json();

      // Get pagination info from headers
      const first = response.headers.get("x-first-page") || "1";
      const prev = response.headers.get("x-prev-page");
      const next = response.headers.get("x-next-page");
      const last = response.headers.get("x-last-page") || "1";
      const pages = response.headers.get("x-total-count");
      const items = response.headers.get("x-total-count");

      // Sort data by newest first (client-side as fallback)
      const sortedData = data.sort(
        (a: News, b: News) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      const paginatedResponse: PaginatedResponse<News> = {
        first: parseInt(first),
        prev: prev ? parseInt(prev) : null,
        next: next ? parseInt(next) : null,
        last: parseInt(last),
        pages: pages ? Math.ceil(parseInt(pages) / limit) : 1,
        items: items ? parseInt(items) : data.length,
        data: sortedData,
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
