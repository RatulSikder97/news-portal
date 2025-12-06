import { API_BASE_URL, API_ENDPOINTS } from "../config/api";
import type { Comment, News } from "../types";

export const newsService = {
  async getAllNews(): Promise<News[]> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.news}`);
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      const news = await response.json();
      // Sort by created_at in descending order (newest first)
      return news.sort(
        (a: News, b: News) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
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

      const news = await response.json();

      const author = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.users}/${news.author_id}`
      );
      if (!author.ok) {
        throw new Error("Failed to fetch author");
      }
      news.author = await author.json();
      return news;
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

  async addComment(
    newsId: number,
    commentData: Omit<Comment, "id" | "created_at">
  ): Promise<Comment> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.comments}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...commentData,
          news_id: newsId,
          created_at: new Date().toISOString(),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
      return await response.json();
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  async getCommentsByNewsId(newsId: number): Promise<Comment[]> {
    try {
      // Fetch the news article to get its comments
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.news}/${newsId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      const news = await response.json();
      const comments = news.comments || [];

      // Fetch user info for each comment
      const commentsWithUsers = await Promise.all(
        comments.map(async (comment: Comment) => {
          try {
            const userResponse = await fetch(
              `${API_BASE_URL}${API_ENDPOINTS.users}/${comment.user_id}`
            );
            if (userResponse.ok) {
              comment.user = await userResponse.json();
            }
          } catch (error) {
            console.error("Error fetching user for comment:", error);
          }
          return comment;
        })
      );

      return commentsWithUsers;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },

  async updateComment(
    commentId: number,
    commentData: Partial<Omit<Comment, "id" | "created_at">>
  ): Promise<Comment> {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.comments}/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(commentData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update comment");
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  },

  async updateCommentByNewsIdAndCommentId(
    newsId: number,
    commentId: number,
    commentData: Partial<Omit<Comment, "id" | "created_at">>
  ): Promise<Comment> {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.news}/${newsId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(commentData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update comment");
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  },

  async deleteComment(commentId: number): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.comments}/${commentId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },

  async deleteCommentByNewsIdAndCommentId(
    newsId: number,
    commentId: number
  ): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.news}/${newsId}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },
};
