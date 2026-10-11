import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { API } from "./api";
import { filterPostsByTitle, filterTodosByStatus } from "./exerciseUtils";
import { useFetch } from "./useFetch";
import type { Comment, Post, Todo, TodoFilter, User } from "./types";

function StateMessage({ kind, children }: { kind: "loading" | "error" | "empty"; children: ReactNode }) {
  return <p className={`state-message state-${kind}`}>{children}</p>;
}

export function ListaPosts() {
  const { data: posts, loading, error } = useFetch<Post[]>(`${API}/posts?userId=1`);
  if (loading) return <StateMessage kind="loading">Carregando posts...</StateMessage>;
  if (error) return <StateMessage kind="error">Não foi possível carregar os posts: {error}</StateMessage>;
  if (!posts?.length) return <StateMessage kind="empty">Nenhum post encontrado.</StateMessage>;
  return (
    <ol className="post-list">
      {posts.map((post) => (
        <li key={post.id}>
          <div className="item-heading"><span className="item-number">{String(post.id).padStart(2, "0")}</span><strong>{post.title}</strong></div>
          <p>{post.body}</p>
        </li>
      ))}
    </ol>
  );
}

function LinhaUsuario({ user }: { user: User }) {
  return (
    <tr>
      <td><strong>{user.name}</strong><span className="muted">@{user.username}</span></td>
      <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
      <td>{user.address.city}</td>
      <td>{user.company.name}</td>
    </tr>
  );
}

export function TabelaUsuarios() {
  const { data: users, loading, error } = useFetch<User[]>(`${API}/users`);
  if (loading) return <StateMessage kind="loading">Carregando usuários...</StateMessage>;
  if (error) return <StateMessage kind="error">Não foi possível carregar os usuários: {error}</StateMessage>;
  if (!users?.length) return <StateMessage kind="empty">Nenhum usuário encontrado.</StateMessage>;
  return (
    <div className="table-wrap"><table><thead><tr><th>Nome</th><th>E-mail</th><th>Cidade</th><th>Empresa</th></tr></thead>
      <tbody>{users.map((user) => <LinhaUsuario key={user.id} user={user} />)}</tbody>
    </table></div>
  );
}

export function TarefasFiltro() {
  const { data: todos, loading, error } = useFetch<Todo[]>(`${API}/todos?userId=1`);
  const [filter, setFilter] = useState<TodoFilter>("todas");
  const visibleTodos = useMemo(() => filterTodosByStatus(todos ?? [], filter), [todos, filter]);
  if (loading) return <StateMessage kind="loading">Carregando tarefas...</StateMessage>;
  if (error) return <StateMessage kind="error">Não foi possível carregar as tarefas: {error}</StateMessage>;
  if (!todos?.length) return <StateMessage kind="empty">Nenhuma tarefa encontrada.</StateMessage>;
  return <>
    <div className="filter-row">{(["todas", "pendentes", "concluidas"] as TodoFilter[]).map((option) => <button key={option} className={`filter-button ${filter === option ? "active" : ""}`} onClick={() => setFilter(option)}>{option}</button>)}</div>
    <p className="result-count">{visibleTodos.length} tarefas <span>de {todos.length}</span></p>
    <ul className="todo-list">{visibleTodos.map((todo) => <li className={todo.completed ? "completed" : ""} key={todo.id}><span className="check">{todo.completed ? "✓" : "○"}</span>{todo.title}</li>)}</ul>
  </>;
}

export function BuscaPosts() {
  const { data: posts, loading, error } = useFetch<Post[]>(`${API}/posts`);
  const [query, setQuery] = useState("");
  const foundPosts = useMemo(() => filterPostsByTitle(posts ?? [], query), [posts, query]);
  if (loading) return <StateMessage kind="loading">Carregando 100 posts...</StateMessage>;
  if (error) return <StateMessage kind="error">Não foi possível carregar os posts: {error}</StateMessage>;
  return <>
    <label className="input-label" htmlFor="post-search">Buscar pelo título</label>
    <input id="post-search" className="text-input" placeholder="ex.: sunt, qui, autem..." value={query} onChange={(event) => setQuery(event.target.value)} />
    <p className="result-count">{foundPosts.length} <span>de {posts?.length ?? 0} encontrados</span></p>
    {foundPosts.length === 0 ? <StateMessage kind="empty">Nenhum resultado para “{query}”.</StateMessage> : <ul className="search-results">{foundPosts.map((post) => <li key={post.id}><strong>{post.title}</strong><p>{post.body}</p></li>)}</ul>}
  </>;
}

export function ComentariosPost() {
  const [postId, setPostId] = useState(1);
  const { data: comments, loading, error } = useFetch<Comment[]>(`${API}/posts/${postId}/comments`);
  return <>
    <div className="inline-control"><label htmlFor="post-id">ID do post</label><input id="post-id" className="number-input" type="number" min={1} max={100} value={postId} onChange={(event) => setPostId(Math.min(100, Math.max(1, Number(event.target.value) || 1)))} /><span className="hint">1 a 100</span></div>
    {loading && <StateMessage kind="loading">Buscando comentários...</StateMessage>}
    {error && <StateMessage kind="error">Não foi possível carregar os comentários: {error}</StateMessage>}
    {!loading && !error && !comments?.length && <StateMessage kind="empty">Nenhum comentário encontrado.</StateMessage>}
    {!loading && !error && comments && comments.length > 0 && <><p className="result-count">{comments.length} <span>comentários no post {postId}</span></p><div className="comment-list">{comments.map((comment) => <article key={comment.id}><div className="comment-meta"><strong>{comment.name}</strong><a href={`mailto:${comment.email}`}>{comment.email}</a></div><p>{comment.body}</p></article>)}</div></>}
  </>;
}

export function ListaRecarregavel() {
  const [attempt, setAttempt] = useState(0);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const { data: todos, loading, error } = useFetch<Todo[]>(`${API}/todos?userId=1&refresh=${attempt}`);
  useEffect(() => { if (todos) setUpdatedAt(new Date()); }, [todos]);
  return <>
    <div className="reload-bar"><div><span className="eyebrow">fonte</span><strong>tarefas do usuário 1</strong>{updatedAt && <span className="hint">Atualizado às {updatedAt.toLocaleTimeString("pt-BR")}</span>}</div><button className="primary-button" onClick={() => setAttempt((value) => value + 1)}>↻ Recarregar</button></div>
    {loading && <StateMessage kind="loading">Buscando uma versão atualizada...</StateMessage>}
    {error && <StateMessage kind="error">Falha na busca: {error}</StateMessage>}
    {!loading && !error && !todos?.length && <StateMessage kind="empty">Nenhuma tarefa encontrada.</StateMessage>}
    {!loading && !error && todos && <ul className="todo-list compact">{todos.map((todo) => <li className={todo.completed ? "completed" : ""} key={todo.id}><span className="check">{todo.completed ? "✓" : "○"}</span>{todo.title}</li>)}</ul>}
  </>;
}
