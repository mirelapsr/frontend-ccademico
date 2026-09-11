import { useMemo, useState } from "react";
import type { Periodo, SituacaoPeriodo } from "../../types";
import CardPeriodo from "./CardPeriodo";
import "./ListaPeriodos.css";

interface ListaPeriodosProps {
  periodos: Periodo[];
  aoNovoPeriodo: () => void;
  aoEditarPeriodo: (idPeriodo: number) => void;
  aoExcluirPeriodo: (idPeriodo: number) => void;
}

type FiltroSituacao = "todas" | SituacaoPeriodo;

function ListaPeriodos({
  periodos,
  aoNovoPeriodo,
  aoEditarPeriodo,
  aoExcluirPeriodo,
}: ListaPeriodosProps) {
  const [busca, setBusca] = useState("");
  const [filtroSituacao, setFiltroSituacao] = useState<FiltroSituacao>("todas");

  const periodosFiltrados = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();

    return periodos.filter((periodo) => {
      const combinaBusca =
        buscaNormalizada === "" ||
        periodo.nomePeriodo.toLowerCase().includes(buscaNormalizada) ||
        String(periodo.ano).includes(buscaNormalizada);

      const combinaFiltro = filtroSituacao === "todas" || periodo.situacao === filtroSituacao;

      return combinaBusca && combinaFiltro;
    });
  }, [periodos, busca, filtroSituacao]);

  return (
    <section className="lista-periodos">
      <header className="lista-periodos__cabecalho">
        <h2>Cadastro de Períodos</h2>
        <button type="button" className="lista-periodos__botao-novo" onClick={aoNovoPeriodo}>
          + Novo Período
        </button>
      </header>

      <div className="lista-periodos__filtros">
        <label className="lista-periodos__busca">
          <IconeBusca />
          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar por nome ou ano..."
            aria-label="Buscar períodos por nome ou ano"
          />
        </label>

        <select
          className="lista-periodos__select"
          value={filtroSituacao}
          onChange={(evento) => setFiltroSituacao(evento.target.value as FiltroSituacao)}
          aria-label="Filtrar por situação"
        >
          <option value="todas">Todas as situações</option>
          <option value="Ativo">Ativo</option>
          <option value="Encerrado">Encerrado</option>
        </select>
      </div>

      {periodosFiltrados.length === 0 ? (
        <p className="lista-periodos__vazio-geral">
          {periodos.length === 0
            ? "Nenhum período cadastrado ainda."
            : "Nenhum período encontrado para esses filtros."}
        </p>
      ) : (
        <div className="lista-periodos__grade">
          {periodosFiltrados.map((periodo) => (
            <CardPeriodo
              key={periodo.idPeriodo}
              periodo={periodo}
              aoEditar={() => aoEditarPeriodo(periodo.idPeriodo)}
              aoExcluir={() => aoExcluirPeriodo(periodo.idPeriodo)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ListaPeriodos;

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
