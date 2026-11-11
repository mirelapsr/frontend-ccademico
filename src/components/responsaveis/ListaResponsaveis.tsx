import { useMemo, useState } from "react";
import type { AlunoResponsavel, Escola, Matricula, Responsavel, Turma } from "../../types";
import { limparDigitos } from "../../utils/formatadores";
import { mapearEscolaPorAluno } from "../../utils/escolaPorAluno";
import CardResponsavel from "./CardResponsavel";
import "./ListaResponsaveis.css";

interface ListaResponsaveisProps {
  responsaveis: Responsavel[];
  escolas: Escola[];
  /** Responsável → vínculos → aluno → matrícula ativa → turma → escola. */
  vinculos: AlunoResponsavel[];
  matriculas: Matricula[];
  turmas: Turma[];
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
  escolas,
  vinculos,
  matriculas,
  turmas,
  carregando,
  erro,
  aoDispensarErro,
  aoRecarregar,
  aoNovoResponsavel,
  aoEditarResponsavel,
  aoExcluirResponsavel,
}: ListaResponsaveisProps) {
  const [busca, setBusca] = useState("");
  const [filtroEscola, setFiltroEscola] = useState("todas"); // "todas" ou o idEscola como texto

  // Lookup O(1): idResponsavel → escolas dos alunos vinculados (pode haver mais de uma).
  const escolasPorResponsavel = useMemo(() => {
    const escolaPorAluno = mapearEscolaPorAluno(matriculas, turmas);
    const mapa = new Map<number, Set<string>>();
    for (const vinculo of vinculos) {
      const escolaId = escolaPorAluno.get(vinculo.alunoId);
      if (escolaId === undefined) continue;
      const escolasDoResp = mapa.get(vinculo.responsavelId) ?? new Set<string>();
      escolasDoResp.add(String(escolaId));
      mapa.set(vinculo.responsavelId, escolasDoResp);
    }
    return mapa;
  }, [vinculos, matriculas, turmas]);

  const responsaveisFiltrados = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();
    const buscaSoDigitos = limparDigitos(busca);

    if (buscaNormalizada === "" && filtroEscola === "todas") return responsaveis;

    return responsaveis.filter((responsavel) => {
      const combinaEscola =
        filtroEscola === "todas" ||
        (escolasPorResponsavel.get(responsavel.idResponsavel)?.has(filtroEscola) ?? false);
      if (!combinaEscola) return false;
      if (buscaNormalizada === "") return true;

      const combinaNome = responsavel.nomeResp.toLowerCase().includes(buscaNormalizada);
      const combinaCpf =
        buscaSoDigitos !== "" && (responsavel.cpfResp ?? "").includes(buscaSoDigitos);
      return combinaNome || combinaCpf;
    });
  }, [responsaveis, escolasPorResponsavel, busca, filtroEscola]);

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

        <select
          className="lista-responsaveis__select"
          value={filtroEscola}
          onChange={(evento) => setFiltroEscola(evento.target.value)}
          aria-label="Filtrar por escola"
        >
          <option value="todas">Todas as escolas</option>
          {escolas.map((escola) => (
            <option key={escola.idEscola} value={escola.idEscola}>
              {escola.nomeEscola}
            </option>
          ))}
        </select>
      </div>

      {carregando ? (
        <p className="lista-responsaveis__estado" role="status">
          Carregando responsáveis...
        </p>
      ) : responsaveisFiltrados.length === 0 ? (
        <p className="lista-responsaveis__vazio-geral">
          {responsaveis.length === 0
            ? "Nenhum responsável cadastrado ainda."
            : "Nenhum responsável encontrado para esses filtros."}
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