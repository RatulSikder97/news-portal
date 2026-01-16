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
  pages: number;
  limit: number;
  current_page: number;
  last_page: number;
  total: number;
  items: T[];
}

export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  msg: string;
  data: T;
  errors: any;
}
