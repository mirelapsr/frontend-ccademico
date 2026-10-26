import { useMemo, useState } from "react";
import type { Responsavel } from "../../types";
import { limparDigitos } from "../../utils/formatadores";
import CardResponsavel from "./CardResponsavel";
import "./ListaResponsaveis.css";

interface ListaResponsaveisProps {
  responsaveis: Responsavel[];
  carregando: boolean;
  erro: string | null;
  aoDispensarErro: () => void;
  aoRecarregar: () => void;
  aoNovoResponsavel: () => void;
  aoEditarResponsavel: (idResponsavel: number) => void;
  aoExcluirResponsavel: (idResponsavel: number) => void;
}

function ListaResponsaveis({
  responsaveis,
  carregando,
  erro,
  aoDispensarErro,
  aoRecarregar,
  aoNovoResponsavel,
  aoEditarResponsavel,
  aoExcluirResponsavel,
}: ListaResponsaveisProps) {
  const [busca, setBusca] = useState("");

  const responsaveisFiltrados = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();
    const buscaSoDigitos = limparDigitos(busca);

    if (buscaNormalizada === "") return responsaveis;

    return responsaveis.filter((responsavel) => {
      const combinaNome = responsavel.nomeResp.toLowerCase().includes(buscaNormalizada);
      const combinaCpf =
        buscaSoDigitos !== "" && (responsavel.cpfResp ?? "").includes(buscaSoDigitos);
      return combinaNome || combinaCpf;
    });
  }, [responsaveis, busca]);

  return (
    <section className="lista-responsaveis">
      <header className="lista-responsaveis__cabecalho">
        <h2>Cadastro de Responsáveis</h2>
        <button
          type="button"
          className="lista-responsaveis__botao-novo"
          onClick={aoNovoResponsavel}
        >
          + Novo Responsável
        </button>
      </header>

      {erro && (
        <div className="lista-responsaveis__alerta" role="alert">
          <p>{erro}</p>
          <div className="lista-responsaveis__alerta-acoes">
            <button type="button" onClick={aoRecarregar} disabled={carregando}>
              Tentar novamente
            </button>
            <button
              type="button"
              className="lista-responsaveis__alerta-fechar"
              onClick={aoDispensarErro}
              aria-label="Dispensar alerta"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="lista-responsaveis__filtros">
        <label className="lista-responsaveis__busca">
          <IconeBusca />
          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar por nome ou CPF..."
            aria-label="Buscar responsáveis por nome ou CPF"
          />
        </label>
      </div>

      {carregando ? (
        <p className="lista-responsaveis__estado" role="status">
          Carregando responsáveis...
        </p>
      ) : responsaveisFiltrados.length === 0 ? (
        <p className="lista-responsaveis__vazio-geral">
          {responsaveis.length === 0
            ? "Nenhum responsável cadastrado ainda."
            : "Nenhum responsável encontrado para essa busca."}
        </p>
      ) : (
        <div className="lista-responsaveis__grade">
          {responsaveisFiltrados.map((responsavel) => (
            <CardResponsavel
              key={responsavel.idResponsavel}
              responsavel={responsavel}
              aoEditar={aoEditarResponsavel}
              aoExcluir={aoExcluirResponsavel}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ListaResponsaveis;

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