export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: { city: string; street: string };
  company: { name: string };
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export type TodoFilter = "todas" | "pendentes" | "concluidas";
