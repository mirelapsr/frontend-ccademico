import { useMemo, useState } from "react";
import type { Escola, Turma, Turno } from "../../types";
import CardTurma from "./CardTurma";
import "./ListaTurmas.css";

interface ListaTurmasProps {
  turmas: Turma[];
  escolas: Escola[];
  aoNovaTurma: () => void;
  aoEditarTurma: (idTurma: number) => void;
  aoExcluirTurma: (idTurma: number) => void;
}

type FiltroTurno = "todas" | Turno;

function ListaTurmas({
  turmas,
  escolas,
  aoNovaTurma,
  aoEditarTurma,
  aoExcluirTurma,
}: ListaTurmasProps) {
  const [busca, setBusca] = useState("");
  const [filtroTurno, setFiltroTurno] = useState<FiltroTurno>("todas");

  const turmasFiltradas = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();

    return turmas.filter((turma) => {
      const escolaVinculada = escolas.find((escola) => escola.idEscola === turma.escolaIdEscola);

      const combinaBusca =
        buscaNormalizada === "" ||
        turma.nomeTurma.toLowerCase().includes(buscaNormalizada) ||
        (turma.serie ?? "").toLowerCase().includes(buscaNormalizada) ||
        (escolaVinculada?.nomeEscola ?? "").toLowerCase().includes(buscaNormalizada);

      const combinaFiltro = filtroTurno === "todas" || turma.turno === filtroTurno;

      return combinaBusca && combinaFiltro;
    });
  }, [turmas, escolas, busca, filtroTurno]);

  return (
    <section className="lista-turmas">
      <header className="lista-turmas__cabecalho">
        <h2>Cadastro de Turmas</h2>
        <button type="button" className="lista-turmas__botao-novo" onClick={aoNovaTurma}>
          + Nova Turma
        </button>
      </header>

      <div className="lista-turmas__filtros">
        <label className="lista-turmas__busca">
          <IconeBusca />
          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar por nome, série ou escola..."
            aria-label="Buscar turmas"
          />
        </label>

        <select
          className="lista-turmas__select"
          value={filtroTurno}
          onChange={(evento) => setFiltroTurno(evento.target.value as FiltroTurno)}
          aria-label="Filtrar por turno"
        >
          <option value="todas">Todos os turnos</option>
          <option value="Manha">Manhã</option>
          <option value="Tarde">Tarde</option>
          <option value="Noite">Noite</option>
          <option value="Integral">Integral</option>
        </select>
      </div>

      {turmasFiltradas.length === 0 ? (
        <p className="lista-turmas__vazio-geral">
          {turmas.length === 0
            ? "Nenhuma turma cadastrada ainda."
            : "Nenhuma turma encontrada para esses filtros."}
        </p>
      ) : (
        <div className="lista-turmas__grade">
          {turmasFiltradas.map((turma) => (
            <CardTurma
              key={turma.idTurma}
              turma={turma}
              escolas={escolas}
              aoEditar={() => aoEditarTurma(turma.idTurma)}
              aoExcluir={() => aoExcluirTurma(turma.idTurma)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ListaTurmas;

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
