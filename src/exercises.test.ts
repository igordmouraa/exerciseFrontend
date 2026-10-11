import { describe, expect, it } from "vitest";
import { filterPostsByTitle, filterTodosByStatus } from "./exerciseUtils";
import type { Post, Todo } from "./types";

const posts: Post[] = [
  { userId: 1, id: 1, title: "Aprender React", body: "..." },
  { userId: 1, id: 2, title: "Fetch com TypeScript", body: "..." },
];

const todos: Todo[] = [
  { userId: 1, id: 1, title: "Concluída", completed: true },
  { userId: 1, id: 2, title: "Pendente", completed: false },
];

describe("filtros derivados dos exercícios", () => {
  it("encontra posts por título sem diferenciar maiúsculas", () => {
    expect(filterPostsByTitle(posts, "REACT")).toEqual([posts[0]]);
  });

  it("filtra tarefas por todos, pendentes e concluídas", () => {
    expect(filterTodosByStatus(todos, "todas")).toHaveLength(2);
    expect(filterTodosByStatus(todos, "pendentes")).toEqual([todos[1]]);
    expect(filterTodosByStatus(todos, "concluidas")).toEqual([todos[0]]);
  });
});
