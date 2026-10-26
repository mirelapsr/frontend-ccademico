import { useMemo, useState } from "react";
import type { Escola } from "../../types";
import { limparDigitos } from "../../utils/formatadores";
import CardEscola from "./CardEscola";
import "./ListaEscolas.css";

interface ListaEscolasProps {
  escolas: Escola[];
  aoNovaEscola: () => void;
  aoEditarEscola: (idEscola: number) => void;
  aoExcluirEscola: (idEscola: number) => void;
  carregando?: boolean;
  erro?: string | null;
  aoDispensarErro?: () => void;
  aoRecarregar?: () => void;
}

type FiltroRede = "todas" | "municipal" | "estadual";

function inferirRede(escola: Escola): FiltroRede | "outra" {
  const nomeEmMinusculas = (escola.redeEnsino || escola.nomeEscola).toLowerCase();
  if (nomeEmMinusculas.includes("municipal")) return "municipal";
  if (nomeEmMinusculas.includes("estadual")) return "estadual";
  return "outra";
}

function ListaEscolas({
  escolas,
  aoNovaEscola,
  aoEditarEscola,
  aoExcluirEscola,
  carregando = false,
  erro = null,
  aoDispensarErro,
  aoRecarregar,
}: ListaEscolasProps) {
  const [busca, setBusca] = useState("");
  const [filtroRede, setFiltroRede] = useState<FiltroRede>("todas");

  const escolasFiltradas = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();
    const buscaNumerica = limparDigitos(busca);

    return escolas.filter((escola) => {
      const combinaNome = escola.nomeEscola.toLowerCase().includes(buscaNormalizada);
      const combinaCnpj =
        buscaNumerica !== "" && (escola.cnpj ?? "").includes(buscaNumerica);
      const combinaInep =
        buscaNumerica !== "" && (escola.codigoInep ?? "").includes(buscaNumerica);

      const combinaBusca =
        buscaNormalizada === "" || combinaNome || combinaCnpj || combinaInep;

      const combinaFiltro =
        filtroRede === "todas" || inferirRede(escola) === filtroRede;

      return combinaBusca && combinaFiltro;
    });
  }, [escolas, busca, filtroRede]);

  return (
    <section className="lista-escolas">
      <header className="lista-escolas__cabecalho">
        <h2>Cadastro de Escolas</h2>
        <button
          type="button"
          className="lista-escolas__botao-novo"
          onClick={aoNovaEscola}
        >
          + Nova Escola
        </button>
      </header>

      {erro && (
        <div className="lista-escolas__erro" role="alert">
          <p>{erro}</p>
          <div className="lista-escolas__erro-acoes">
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

      <div className="lista-escolas__filtros">
        <label className="lista-escolas__busca">
          <IconeBusca />
          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar por nome, CNPJ ou INEP..."
            aria-label="Buscar escolas"
          />
        </label>

        <select
          className="lista-escolas__select"
          value={filtroRede}
          onChange={(evento) => setFiltroRede(evento.target.value as FiltroRede)}
          aria-label="Filtrar por rede de ensino"
        >
          <option value="todas">Todas as escolas</option>
          <option value="municipal">Municipais</option>
          <option value="estadual">Estaduais</option>
        </select>
      </div>

      {escolasFiltradas.length === 0 ? (
        <p className="lista-escolas__vazio-geral">
          {carregando
            ? "Carregando escolas..."
            : escolas.length === 0
              ? "Nenhuma escola cadastrada ainda."
              : "Nenhuma escola encontrada para esses filtros."}
        </p>
      ) : (
        <div className="lista-escolas__grade">
          {escolasFiltradas.map((escola) => (
            <CardEscola
              key={escola.idEscola}
              escola={escola}
              aoEditar={() => aoEditarEscola(escola.idEscola)}
              aoExcluir={() => aoExcluirEscola(escola.idEscola)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ListaEscolas;

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