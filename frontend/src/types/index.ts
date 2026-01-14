export interface User {
  _id: string; // Backend uses _id
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
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
  _id: string;
  news_id: string;
  user_id: string;
  text: string;
  created_at: string;
  user?: User;
}

export interface News {
  _id: string; // Backend uses _id
  title: string;
  body: string;
  author_id: string;
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
