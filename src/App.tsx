import { useState } from "react";
import { BuscaPosts, ComentariosPost, ListaPosts, ListaRecarregavel, TabelaUsuarios, TarefasFiltro } from "./components";

const exercises = [
  { id: "01", label: "Lista de posts", kicker: "fetch + map", description: "Os primeiros dados vindos da API.", component: <ListaPosts /> },
  { id: "02", label: "Tabela de usuários", kicker: "objetos aninhados", description: "Lendo relações e transformando dados em tabela.", component: <TabelaUsuarios /> },
  { id: "03", label: "Tarefas por status", kicker: "filter + state", description: "Estado derivado para alternar a visão.", component: <TarefasFiltro /> },
  { id: "04", label: "Busca por título", kicker: "input controlado", description: "Filtragem no cliente, sem novo fetch.", component: <BuscaPosts /> },
  { id: "05", label: "Comentários", kicker: "dependência + cleanup", description: "Uma rota aninhada que acompanha o post escolhido.", component: <ComentariosPost /> },
  { id: "06", label: "Botão recarregar", kicker: "useEffect + retry", description: "Forçando uma nova busca com state.", component: <ListaRecarregavel /> },
];

function App() {
  const [activeId, setActiveId] = useState(exercises[0].id);
  const activeExercise = exercises.find((exercise) => exercise.id === activeId) ?? exercises[0];
  return <main className="app-shell">
    <header className="hero">
      <h1>Exercícios de Paradigmas da Programação II</h1>
    </header>
    <section className="workspace">
      <aside className="exercise-nav" aria-label="Exercícios"><div className="nav-heading"><span>Roteiro</span><span>06 exercícios</span></div>{exercises.map((exercise) => <button key={exercise.id} className={`exercise-link ${activeId === exercise.id ? "selected" : ""}`} onClick={() => setActiveId(exercise.id)}><span className="exercise-id">{exercise.id}</span><span className="exercise-link-copy"><strong>{exercise.label}</strong><small>{exercise.kicker}</small></span></button>)}</aside>
      <section className="exercise-panel"><div className="panel-intro"><div><p className="eyebrow">Exercício {activeExercise.id} · {activeExercise.kicker}</p><h2>{activeExercise.label}</h2><p>{activeExercise.description}</p></div></div><div className="panel-content">{activeExercise.component}</div></section>
    </section>
    <footer><span>React · TypeScript · useEffect</span></footer>
  </main>;
}

export default App;
