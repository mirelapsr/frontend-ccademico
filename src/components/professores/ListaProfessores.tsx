import { useMemo, useState } from "react";
import type { Escola, Professor, SituacaoProfessor } from "../../types";
import { limparDigitos } from "../../utils/formatadores";
import CardProfessor from "./CardProfessor";
import "./ListaProfessores.css";

interface ListaProfessoresProps {
  professores: Professor[];
  escolas: Escola[];
  aoNovoProfessor: () => void;
  aoEditarProfessor: (idProfessor: number) => void;
  aoExcluirProfessor: (idProfessor: number) => void;
  carregando?: boolean;
  erro?: string | null;
  aoDispensarErro?: () => void;
  aoRecarregar?: () => void;
}

type FiltroSituacao = "todas" | SituacaoProfessor;

function ListaProfessores({
  professores,
  escolas,
  aoNovoProfessor,
  aoEditarProfessor,
  aoExcluirProfessor,
  carregando = false,
  erro = null,
  aoDispensarErro,
  aoRecarregar,
}: ListaProfessoresProps) {
  const [busca, setBusca] = useState("");
  const [filtroSituacao, setFiltroSituacao] = useState<FiltroSituacao>("todas");

  const professoresFiltrados = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();
    const buscaNumerica = limparDigitos(busca);

    return professores.filter((professor) => {
      const combinaNome = professor.nomeProf.toLowerCase().includes(buscaNormalizada);
      const combinaCpf =
        buscaNumerica !== "" && (professor.cpfProf ?? "").includes(buscaNumerica);

      const combinaBusca = buscaNormalizada === "" || combinaNome || combinaCpf;
      const combinaFiltro = filtroSituacao === "todas" || professor.situacao === filtroSituacao;

      return combinaBusca && combinaFiltro;
    });
  }, [professores, busca, filtroSituacao]);

  return (
    <section className="lista-professores">
      <header className="lista-professores__cabecalho">
        <h2>Cadastro de Professores</h2>
        <button type="button" className="lista-professores__botao-novo" onClick={aoNovoProfessor}>
          + Novo Professor
        </button>
      </header>

      {erro && (
        <div className="lista-professores__erro" role="alert">
          <p>{erro}</p>
          <div className="lista-professores__erro-acoes">
            {aoRecarregar && (
              <button type="button" onClick={aoRecarregar} disabled={carregando}>
                Recarregar
              </button>
            )}
            {aoDispensarErro && (
              <button type="button" onClick={aoDispensarErro} aria-label="Dispensar aviso">
                ×
              </button>
            )}
          </div>
        </div>
      )}

      <div className="lista-professores__filtros">
        <label className="lista-professores__busca">
          <IconeBusca />
          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar por nome ou CPF..."
            aria-label="Buscar professores por nome ou CPF"
          />
        </label>

        <select
          className="lista-professores__select"
          value={filtroSituacao}
          onChange={(evento) => setFiltroSituacao(evento.target.value as FiltroSituacao)}
          aria-label="Filtrar por situação"
        >
          <option value="todas">Todas as situações</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
      </div>

      {professoresFiltrados.length === 0 ? (
        <p className="lista-professores__vazio-geral">
          {carregando
            ? "Carregando professores..."
            : professores.length === 0
              ? "Nenhum professor cadastrado ainda."
              : "Nenhum professor encontrado para esses filtros."}
        </p>
      ) : (
        <div className="lista-professores__grade">
          {professoresFiltrados.map((professor) => (
            <CardProfessor
              key={professor.idProfessor}
              professor={professor}
              escolas={escolas}
              aoEditar={() => aoEditarProfessor(professor.idProfessor)}
              aoExcluir={() => aoExcluirProfessor(professor.idProfessor)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ListaProfessores;

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