import { useMemo, useState } from "react";
import type { Escola, GradeCurricular, Materia, Turma } from "../../types";
import CardMateria from "./CardMateria";
import "./ListaMaterias.css";

interface ListaMateriasProps {
  materias: Materia[];
  escolas: Escola[];
  /** Matéria não tem FK de escola: materiaId → grade → turma → escolaId. */
  grades: GradeCurricular[];
  turmas: Turma[];
  aoNovaMateria: () => void;
  aoEditarMateria: (idMateria: number) => void;
  aoExcluirMateria: (idMateria: number) => void;
  carregando?: boolean;
  erro?: string | null;
  aoDispensarErro?: () => void;
  aoRecarregar?: () => void;
}

function ListaMaterias({
  materias,
  escolas,
  grades,
  turmas,
  aoNovaMateria,
  aoEditarMateria,
  aoExcluirMateria,
  carregando = false,
  erro = null,
  aoDispensarErro,
  aoRecarregar,
}: ListaMateriasProps) {
  const [busca, setBusca] = useState("");
  const [filtroEscola, setFiltroEscola] = useState("todas"); // "todas" ou o idEscola como texto

  // Lookup O(1): idMateria → escolas onde ela é ofertada (via grade → turma).
  const escolasPorMateria = useMemo(() => {
    const escolaPorTurma = new Map(turmas.map((turma) => [turma.idTurma, turma.escolaId]));
    const mapa = new Map<number, Set<string>>();
    for (const grade of grades) {
      const escolaId = escolaPorTurma.get(grade.turmaId);
      if (escolaId === undefined) continue;
      const escolasDaMateria = mapa.get(grade.materiaId) ?? new Set<string>();
      escolasDaMateria.add(String(escolaId));
      mapa.set(grade.materiaId, escolasDaMateria);
    }
    return mapa;
  }, [grades, turmas]);

  const materiasFiltradas = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();
    if (buscaNormalizada === "" && filtroEscola === "todas") return materias;
    return materias.filter((materia) => {
      const combinaBusca =
        buscaNormalizada === "" || materia.nomeMateria.toLowerCase().includes(buscaNormalizada);
      const combinaEscola =
        filtroEscola === "todas" ||
        (escolasPorMateria.get(materia.idMateria)?.has(filtroEscola) ?? false);
      return combinaBusca && combinaEscola;
    });
  }, [materias, escolasPorMateria, busca, filtroEscola]);

  return (
    <section className="lista-materias">
      <header className="lista-materias__cabecalho">
        <h2>Cadastro de Matérias</h2>
        <button type="button" className="lista-materias__botao-novo" onClick={aoNovaMateria}>
          + Nova Matéria
        </button>
      </header>

      {erro && (
        <div className="lista-materias__erro" role="alert">
          <p>{erro}</p>
          <div className="lista-materias__erro-acoes">
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

      <div className="lista-materias__filtros">
        <label className="lista-materias__busca">
          <IconeBusca />
          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar por nome da matéria..."
            aria-label="Buscar matérias por nome"
          />
        </label>

        <select
          className="lista-materias__select"
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

      {materiasFiltradas.length === 0 ? (
        <p className="lista-materias__vazio-geral">
          {carregando
            ? "Carregando matérias..."
            : materias.length === 0
              ? "Nenhuma matéria cadastrada ainda."
              : "Nenhuma matéria encontrada para esses filtros."}
        </p>
      ) : (
        <div className="lista-materias__grade">
          {materiasFiltradas.map((materia) => (
            <CardMateria
              key={materia.idMateria}
              materia={materia}
              aoEditar={() => aoEditarMateria(materia.idMateria)}
              aoExcluir={() => aoExcluirMateria(materia.idMateria)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ListaMaterias;

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
