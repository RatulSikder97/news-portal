export interface User {
  id: number;
  name: string;
  email: string;
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
