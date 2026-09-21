import { useMemo, useState } from "react";
import type { Boletim, SituacaoBoletim, Matricula, Aluno, Turma, Periodo } from "../../types";
import CardBoletim from "./CardBoletim";
import "./ListaBoletins.css";

interface ListaBoletinsProps {
  boletins: Boletim[];
  matriculas: Matricula[];
  alunos: Aluno[];
  turmas: Turma[];
  periodos: Periodo[];
  aoNovoBoletim: () => void;
  aoEditarBoletim: (idBoletim: number) => void;
  aoExcluirBoletim: (idBoletim: number) => void;
}

type FiltroSituacao = "todas" | SituacaoBoletim;

function ListaBoletins({
  boletins,
  matriculas,
  alunos,
  turmas,
  periodos,
  aoNovoBoletim,
  aoEditarBoletim,
  aoExcluirBoletim,
}: ListaBoletinsProps) {
  const [busca, setBusca] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState<"todos" | number>("todos");
  const [filtroSituacao, setFiltroSituacao] = useState<FiltroSituacao>("todas");

  const boletinsFiltrados = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();

    return boletins.filter((boletim) => {
      const matricula = matriculas.find((item) => item.idMatricula === boletim.matriculaIdMatricula);
      const aluno = matricula ? alunos.find((item) => item.idAluno === matricula.alunoIdAluno) : undefined;
      const turma = matricula ? turmas.find((item) => item.idTurma === matricula.turmaIdTurma) : undefined;

      const combinaBusca =
        buscaNormalizada === "" ||
        (aluno?.nomeAluno ?? "").toLowerCase().includes(buscaNormalizada) ||
        (turma?.nomeTurma ?? "").toLowerCase().includes(buscaNormalizada);

      const combinaPeriodo = filtroPeriodo === "todos" || boletim.periodoIdPeriodo === filtroPeriodo;
      const combinaSituacao = filtroSituacao === "todas" || boletim.situacao === filtroSituacao;

      return combinaBusca && combinaPeriodo && combinaSituacao;
    });
  }, [boletins, matriculas, alunos, turmas, busca, filtroPeriodo, filtroSituacao]);

  return (
    <section className="lista-boletins">
      <header className="lista-boletins__cabecalho">
        <h2>Boletim Escolar</h2>
        <button type="button" className="lista-boletins__botao-novo" onClick={aoNovoBoletim}>
          + Novo Boletim
        </button>
      </header>

      <div className="lista-boletins__filtros">
        <label className="lista-boletins__busca">
          <IconeBusca />
          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar por aluno ou turma..."
            aria-label="Buscar boletins"
          />
        </label>

        <select
          className="lista-boletins__select"
          value={filtroPeriodo}
          onChange={(evento) =>
            setFiltroPeriodo(evento.target.value === "todos" ? "todos" : Number(evento.target.value))
          }
          aria-label="Filtrar por período letivo"
        >
          <option value="todos">Todos os períodos</option>
          {periodos.map((periodo) => (
            <option key={periodo.idPeriodo} value={periodo.idPeriodo}>
              {periodo.nomePeriodo} ({periodo.ano})
            </option>
          ))}
        </select>

        <select
          className="lista-boletins__select"
          value={filtroSituacao}
          onChange={(evento) => setFiltroSituacao(evento.target.value as FiltroSituacao)}
          aria-label="Filtrar por situação"
        >
          <option value="todas">Todas as situações</option>
          <option value="Aprovado">Aprovado</option>
          <option value="Reprovado">Reprovado</option>
          <option value="Recuperacao">Recuperação</option>
          <option value="Em Andamento">Em Andamento</option>
        </select>
      </div>

      {boletinsFiltrados.length === 0 ? (
        <p className="lista-boletins__vazio-geral">
          {boletins.length === 0
            ? "Nenhum boletim lançado ainda."
            : "Nenhum boletim encontrado para esses filtros."}
        </p>
      ) : (
        <div className="lista-boletins__grade">
          {boletinsFiltrados.map((boletim) => (
            <CardBoletim
              key={boletim.idBoletim}
              boletim={boletim}
              matriculas={matriculas}
              alunos={alunos}
              turmas={turmas}
              periodos={periodos}
              aoEditar={() => aoEditarBoletim(boletim.idBoletim)}
              aoExcluir={() => aoExcluirBoletim(boletim.idBoletim)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ListaBoletins;

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
