import type { Materia } from "../../types";
import "./CardMateria.css";

interface CardMateriaProps {
  materia: Materia;
  aoEditar: () => void;
  aoExcluir: () => void;
}

function CardMateria({ materia, aoEditar, aoExcluir }: CardMateriaProps) {
  return (
    <article className="card-materia">
      <div className="card-materia__titulo-bloco">
        <h3 className="card-materia__nome">{materia.nomeMateria}</h3>
        <p className="card-materia__carga">
          <IconeRelogio />
          {materia.cargaHoraria != null ? (
            `${materia.cargaHoraria}h de carga horária`
          ) : (
            <span className="card-materia__vazio">Carga horária não informada</span>
          )}
        </p>
      </div>

      <div className="card-materia__acoes">
        <button type="button" className="card-materia__botao-editar" onClick={aoEditar}>
          Editar
        </button>
        <button
          type="button"
          className="card-materia__botao-excluir"
          onClick={aoExcluir}
          aria-label={`Excluir ${materia.nomeMateria}`}
          title="Excluir"
        >
          <IconeLixeira />
        </button>
      </div>
    </article>
  );
}

export default CardMateria;

function IconeRelogio() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10 6v4.2l3 1.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconeLixeira() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" focusable="false">
      <path
        d="M4 6h12M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6M5.5 6l.6 10.2a1.5 1.5 0 0 0 1.5 1.4h4.8a1.5 1.5 0 0 0 1.5-1.4L14.5 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
