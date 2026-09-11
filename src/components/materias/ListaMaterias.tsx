import { useMemo, useState } from "react";
import type { Materia } from "../../types";
import CardMateria from "./CardMateria";
import "./ListaMaterias.css";

interface ListaMateriasProps {
  materias: Materia[];
  aoNovaMateria: () => void;
  aoEditarMateria: (idMateria: number) => void;
  aoExcluirMateria: (idMateria: number) => void;
}

function ListaMaterias({
  materias,
  aoNovaMateria,
  aoEditarMateria,
  aoExcluirMateria,
}: ListaMateriasProps) {
  const [busca, setBusca] = useState("");

  const materiasFiltradas = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();
    if (buscaNormalizada === "") return materias;
    return materias.filter((materia) =>
      materia.nomeMateria.toLowerCase().includes(buscaNormalizada)
    );
  }, [materias, busca]);

  return (
    <section className="lista-materias">
      <header className="lista-materias__cabecalho">
        <h2>Cadastro de Matérias</h2>
        <button type="button" className="lista-materias__botao-novo" onClick={aoNovaMateria}>
          + Nova Matéria
        </button>
      </header>

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
      </div>

      {materiasFiltradas.length === 0 ? (
        <p className="lista-materias__vazio-geral">
          {materias.length === 0
            ? "Nenhuma matéria cadastrada ainda."
            : "Nenhuma matéria encontrada para essa busca."}
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
