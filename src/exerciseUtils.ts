import type { Post, Todo, TodoFilter } from "./types";

export function filterPostsByTitle(posts: Post[], query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return posts.filter((post) =>
    post.title.toLocaleLowerCase().includes(normalizedQuery),
  );
}

export function filterTodosByStatus(todos: Todo[], filter: TodoFilter) {
  if (filter === "pendentes") return todos.filter((todo) => !todo.completed);
  if (filter === "concluidas") return todos.filter((todo) => todo.completed);
  return todos;
}
