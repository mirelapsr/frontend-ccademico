import { useMemo, useState } from "react";
import type { Aluno, SituacaoAluno } from "../../types";
import CardAluno from "./CardAluno";
import "./ListaAlunos.css";

interface ListaAlunosProps {
  alunos: Aluno[];
  aoNovoAluno: () => void;
  aoEditarAluno: (idAluno: number) => void;
  aoExcluirAluno: (idAluno: number) => void;
}

type FiltroSituacao = "todas" | SituacaoAluno;

function ListaAlunos({ alunos, aoNovoAluno, aoEditarAluno, aoExcluirAluno }: ListaAlunosProps) {
  const [busca, setBusca] = useState("");
  const [filtroSituacao, setFiltroSituacao] = useState<FiltroSituacao>("todas");

  const alunosFiltrados = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();

    return alunos.filter((aluno) => {
      const combinaBusca =
        buscaNormalizada === "" ||
        aluno.nomeAluno.toLowerCase().includes(buscaNormalizada) ||
        (aluno.cpfAluno ?? "").toLowerCase().includes(buscaNormalizada) ||
        aluno.numeroMatricula.toLowerCase().includes(buscaNormalizada);

      const combinaFiltro = filtroSituacao === "todas" || aluno.situacao === filtroSituacao;

      return combinaBusca && combinaFiltro;
    });
  }, [alunos, busca, filtroSituacao]);

  return (
    <section className="lista-alunos">
      <header className="lista-alunos__cabecalho">
        <h2>Cadastro de Alunos</h2>
        <button type="button" className="lista-alunos__botao-novo" onClick={aoNovoAluno}>
          + Novo Aluno
        </button>
      </header>

      <div className="lista-alunos__filtros">
        <label className="lista-alunos__busca">
          <IconeBusca />
          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar por nome, CPF ou matrícula..."
            aria-label="Buscar alunos"
          />
        </label>

        <select
          className="lista-alunos__select"
          value={filtroSituacao}
          onChange={(evento) => setFiltroSituacao(evento.target.value as FiltroSituacao)}
          aria-label="Filtrar por situação"
        >
          <option value="todas">Todas as situações</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
          <option value="Transferido">Transferido</option>
        </select>
      </div>

      {alunosFiltrados.length === 0 ? (
        <p className="lista-alunos__vazio-geral">
          {alunos.length === 0
            ? "Nenhum aluno cadastrado ainda."
            : "Nenhum aluno encontrado para esses filtros."}
        </p>
      ) : (
        <div className="lista-alunos__grade">
          {alunosFiltrados.map((aluno) => (
            <CardAluno
              key={aluno.idAluno}
              aluno={aluno}
              aoEditar={() => aoEditarAluno(aluno.idAluno)}
              aoExcluir={() => aoExcluirAluno(aluno.idAluno)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ListaAlunos;

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
