import { useState, type FormEvent } from "react";
import type { Materia, MateriaEntrada } from "../../types";
import "./FormularioMateria.css";

interface FormularioMateriaProps {
  materiaEditando?: Materia | null;
  salvar: (dados: MateriaEntrada) => void;
  cancelar: () => void;
}

function FormularioMateria({ materiaEditando, salvar, cancelar }: FormularioMateriaProps) {
  const [nomeMateria, setNomeMateria] = useState(materiaEditando?.nomeMateria ?? "");
  const [cargaHoraria, setCargaHoraria] = useState(
    materiaEditando?.cargaHoraria !== null && materiaEditando?.cargaHoraria !== undefined
      ? String(materiaEditando.cargaHoraria)
      : ""
  );
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!nomeMateria.trim()) {
      setErro("O nome da matéria é obrigatório.");
      return;
    }

    setErro(null);
    salvar({
      nomeMateria: nomeMateria.trim(),
      cargaHoraria: cargaHoraria.trim() ? Number(cargaHoraria) : null,
    });
  }

  return (
    <section className="formulario-materia">
      <header className="formulario-materia__cabecalho">
        <h2>{materiaEditando ? "Editar Matéria" : "Nova Matéria"}</h2>
      </header>

      <form className="formulario-materia__form" onSubmit={handleSubmit} noValidate>
        <label className="formulario-materia__campo formulario-materia__campo--largo">
          <span>Nome da matéria *</span>
          <input
            value={nomeMateria}
            onChange={(evento) => setNomeMateria(evento.target.value)}
            placeholder="Ex.: Matemática"
          />
        </label>

        <label className="formulario-materia__campo">
          <span>Carga horária (h)</span>
          <input
            type="number"
            min={1}
            value={cargaHoraria}
            onChange={(evento) => setCargaHoraria(evento.target.value)}
            placeholder="Opcional"
          />
        </label>

        {erro && (
          <p className="formulario-materia__erro" role="alert">
            {erro}
          </p>
        )}

        <div className="formulario-materia__acoes">
          <button
            type="button"
            className="formulario-materia__botao-cancelar"
            onClick={cancelar}
          >
            Cancelar
          </button>
          <button type="submit" className="formulario-materia__botao-salvar">
            {materiaEditando ? "Salvar alterações" : "Cadastrar matéria"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioMateria;
