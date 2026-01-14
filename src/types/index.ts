export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  id?: number;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Comment {
  id: number;
  news_id: number;
  user_id: number;
  text: string;
  created_at: string;
  user?: User;
}

export interface News {
  id: number;
  title: string;
  body: string;
  author_id: number;
  created_at: string;
  comments: Comment[];
  author?: User;
}

export interface PaginatedResponse<T> {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: T[];
}
