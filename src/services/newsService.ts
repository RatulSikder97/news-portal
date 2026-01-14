import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from "../config/api";
import {
  ERROR_CREATE_NEWS,
  ERROR_DELETE_NEWS,
  ERROR_LOAD_NEWS,
  ERROR_LOAD_NEWS_DETAIL,

  ERROR_UPDATE_NEWS,
  ERROR_POST_COMMENT,
} from "../config/constants";
import type { News, PaginatedResponse } from "../types";

const endpoints = {
  getAll: `${API_BASE_URL}${API_ENDPOINTS.news}`,
  getById: (id: string) => `${API_BASE_URL}${API_ENDPOINTS.news}/${id}`,
  create: `${API_BASE_URL}${API_ENDPOINTS.news}`,
  update: (id: string) => `${API_BASE_URL}${API_ENDPOINTS.news}/${id}`,
  delete: (id: string) => `${API_BASE_URL}${API_ENDPOINTS.news}/${id}`,
  addComment: (id: string) => `${API_BASE_URL}${API_ENDPOINTS.news}/${id}/comments`,
  removeComment: (id: string, commentId: string) => `${API_BASE_URL}${API_ENDPOINTS.news}/${id}/comments/${commentId}`,
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

      params.append("_sort", "_id");
      params.append("_order", "desc");

      const response = await fetch(`${url}?${params.toString()}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(ERROR_LOAD_NEWS);
      }

      const json = await response.json();
      const data = json.data;

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

  async getNewsById(id: string): Promise<News> {
    try {
      const response = await fetch(`${endpoints.getById(id)}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(ERROR_LOAD_NEWS_DETAIL);
      }

      const json = await response.json();
      const news = json.data;

      // Author is commonly populated by backend now, but if not we fetch it.
      // Current backend populates comments but maybe not author in deep way if simple ObjectId?
      // Actually backend schema says author_id is ObjectId ref 'User'.
      // NewsService.findOne populates 'comments'. It does NOT populate 'author_id' explicitly in my previous code 
      // (only 'comments'). So we might still need to fetch author if backend doesn't populate it.
      // However, frontend types say `author?: User`.

      // Let's keep the author fetch logic for now to be safe, assuming backend returns author_id as string.
      if (news.author_id && typeof news.author_id === 'string') {
        const authorResponse = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.users}/${news.author_id}`,
          {
            headers: getAuthHeaders(),
          }
        );
        if (authorResponse.ok) {
          const authorJson = await authorResponse.json();
          news.author = authorJson.data;
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
      const response = await fetch(`${endpoints.create}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(newsData),
      });

      if (!response.ok) {
        throw new Error(ERROR_CREATE_NEWS);
      }
      const json = await response.json();
      return json.data;
    } catch (error) {
      console.error(ERROR_CREATE_NEWS, error);
      throw error;
    }
  },

  async updateNews(id: string, newsData: Partial<News>): Promise<News> {
    try {
      // Remove restricted fields
      const { _id, author_id, created_at, comments, ...updateData } = newsData as any;

      const response = await fetch(`${endpoints.update(id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        throw new Error(ERROR_UPDATE_NEWS);
      }
      const json = await response.json();
      return json.data;
    } catch (error) {
      console.error(ERROR_UPDATE_NEWS, error);
      throw error;
    }
  },

  async deleteNews(id: string): Promise<void> {
    try {
      const response = await fetch(`${endpoints.delete(id)}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(ERROR_DELETE_NEWS);
      }
    } catch (error) {
      console.error(ERROR_DELETE_NEWS, error);
      throw error;
    }
  },

  async addComment(newsId: string, text: string): Promise<News> {
    try {
      const response = await fetch(`${endpoints.addComment(newsId)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(ERROR_POST_COMMENT);
      }
      const json = await response.json();
      return json.data; // Backend returns the updated News object
    } catch (error) {
      console.error(ERROR_POST_COMMENT, error);
      throw error;
    }
  },

  async removeComment(newsId: string, commentId: string): Promise<News> {
    try {
      const response = await fetch(`${endpoints.removeComment(newsId, commentId)}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }
      const json = await response.json();
      return json.data;
    } catch (error) {
      console.error("Failed to delete comment", error);
      throw error;
    }
  }
};
