import { useMemo, useState } from "react";
import type { Avaliacao, TipoAvaliacao, GradeCurricular, Materia, Turma, Periodo } from "../../types";
import CardAvaliacao from "./CardAvaliacao";
import "./ListaAvaliacoes.css";

interface ListaAvaliacoesProps {
  avaliacoes: Avaliacao[];
  grades: GradeCurricular[];
  materias: Materia[];
  turmas: Turma[];
  periodos: Periodo[];
  aoNovaAvaliacao: () => void;
  aoEditarAvaliacao: (idAvaliacao: number) => void;
  aoExcluirAvaliacao: (idAvaliacao: number) => void;
}

type FiltroTipo = "todos" | TipoAvaliacao;

function ListaAvaliacoes({
  avaliacoes,
  grades,
  materias,
  turmas,
  periodos,
  aoNovaAvaliacao,
  aoEditarAvaliacao,
  aoExcluirAvaliacao,
}: ListaAvaliacoesProps) {
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("todos");

  const avaliacoesFiltradas = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();

    return avaliacoes.filter((avaliacao) => {
      const grade = grades.find((item) => item.idGrade === avaliacao.gradeIdGrade);
      const materia = grade ? materias.find((item) => item.idMateria === grade.materiaIdMateria) : undefined;
      const turma = grade ? turmas.find((item) => item.idTurma === grade.turmaIdTurma) : undefined;

      const combinaBusca =
        buscaNormalizada === "" ||
        avaliacao.nomeAvaliacao.toLowerCase().includes(buscaNormalizada) ||
        (materia?.nomeMateria ?? "").toLowerCase().includes(buscaNormalizada) ||
        (turma?.nomeTurma ?? "").toLowerCase().includes(buscaNormalizada);

      const combinaFiltro = filtroTipo === "todos" || avaliacao.tipo === filtroTipo;

      return combinaBusca && combinaFiltro;
    });
  }, [avaliacoes, grades, materias, turmas, busca, filtroTipo]);

  return (
    <section className="lista-avaliacoes">
      <header className="lista-avaliacoes__cabecalho">
        <h2>Avaliações</h2>
        <button type="button" className="lista-avaliacoes__botao-novo" onClick={aoNovaAvaliacao}>
          + Nova Avaliação
        </button>
      </header>

      <div className="lista-avaliacoes__filtros">
        <label className="lista-avaliacoes__busca">
          <IconeBusca />
          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar por nome, matéria ou turma..."
            aria-label="Buscar avaliações"
          />
        </label>

        <select
          className="lista-avaliacoes__select"
          value={filtroTipo}
          onChange={(evento) => setFiltroTipo(evento.target.value as FiltroTipo)}
          aria-label="Filtrar por tipo"
        >
          <option value="todos">Todos os tipos</option>
          <option value="Prova">Prova</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Seminario">Seminário</option>
          <option value="Participacao">Participação</option>
          <option value="Outro">Outro</option>
        </select>
      </div>

      {avaliacoesFiltradas.length === 0 ? (
        <p className="lista-avaliacoes__vazio-geral">
          {avaliacoes.length === 0
            ? "Nenhuma avaliação cadastrada ainda."
            : "Nenhuma avaliação encontrada para esses filtros."}
        </p>
      ) : (
        <div className="lista-avaliacoes__grade">
          {avaliacoesFiltradas.map((avaliacao) => (
            <CardAvaliacao
              key={avaliacao.idAvaliacao}
              avaliacao={avaliacao}
              grades={grades}
              materias={materias}
              turmas={turmas}
              periodos={periodos}
              aoEditar={() => aoEditarAvaliacao(avaliacao.idAvaliacao)}
              aoExcluir={() => aoExcluirAvaliacao(avaliacao.idAvaliacao)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ListaAvaliacoes;

function IconeBusca() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false">
      <circle cx="9" cy="9" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <line
        x1="13.8"
        y1="13.8"
        x2="18.2"
        y2="18.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
