import { useState, type FormEvent } from "react";
import type { GradeCurricular, GradeCurricularEntrada, Turma, Materia, Professor } from "../../types";
import "./FormularioGrade.css";

interface FormularioGradeProps {
  gradeEditando?: GradeCurricular | null;
  /** Turmas cadastradas, para o <select> de turma. */
  turmas: Turma[];
  /** Matérias cadastradas, para o <select> de matéria. */
  materias: Materia[];
  /** Professores cadastrados, para o <select> de professor. */
  professores: Professor[];
  /**
   * Espelha a constraint `uq_grade_turma_materia`: recebe a combinação
   * candidata de turma+matéria e deve responder se já existe outra grade
   * com esse par (a que está sendo editada não conta).
   */
  existeGradeDuplicada: (turmaIdTurma: number, materiaIdMateria: number) => boolean;
  salvar: (dados: GradeCurricularEntrada) => void;
  cancelar: () => void;
}

function anoAtual(): number {
  return new Date().getFullYear();
}

function FormularioGrade({
  gradeEditando,
  turmas,
  materias,
  professores,
  existeGradeDuplicada,
  salvar,
  cancelar,
}: FormularioGradeProps) {
  const [turmaIdTurma, setTurmaIdTurma] = useState(
    gradeEditando?.turmaIdTurma ?? turmas[0]?.idTurma ?? 0
  );
  const [materiaIdMateria, setMateriaIdMateria] = useState(
    gradeEditando?.materiaIdMateria ?? materias[0]?.idMateria ?? 0
  );
  const [professorIdProfessor, setProfessorIdProfessor] = useState(
    gradeEditando?.professorIdProfessor ?? professores[0]?.idProfessor ?? 0
  );
  const [anoLetivo, setAnoLetivo] = useState(gradeEditando?.anoLetivo ?? anoAtual());
  const [cargaHorariaSemanal, setCargaHorariaSemanal] = useState(
    gradeEditando?.cargaHorariaSemanal?.toString() ?? ""
  );
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!turmaIdTurma || !materiaIdMateria || !professorIdProfessor || !anoLetivo) {
      setErro("Turma, matéria, professor e ano letivo são obrigatórios.");
      return;
    }

    if (existeGradeDuplicada(Number(turmaIdTurma), Number(materiaIdMateria))) {
      const turma = turmas.find((item) => item.idTurma === Number(turmaIdTurma));
      const materia = materias.find((item) => item.idMateria === Number(materiaIdMateria));
      setErro(
        `A turma "${turma?.nomeTurma ?? "selecionada"}" já tem "${
          materia?.nomeMateria ?? "essa matéria"
        }" cadastrada na grade curricular.`
      );
      return;
    }

    setErro(null);
    salvar({
      turmaIdTurma: Number(turmaIdTurma),
      materiaIdMateria: Number(materiaIdMateria),
      professorIdProfessor: Number(professorIdProfessor),
      anoLetivo: Number(anoLetivo),
      cargaHorariaSemanal: cargaHorariaSemanal ? Number(cargaHorariaSemanal) : null,
    });
  }

  return (
    <section className="formulario-grade">
      <header className="formulario-grade__cabecalho">
        <h2>{gradeEditando ? "Editar Grade Curricular" : "Nova Grade Curricular"}</h2>
      </header>

      <form className="formulario-grade__form" onSubmit={handleSubmit} noValidate>
        <label className="formulario-grade__campo formulario-grade__campo--largo">
          <span>Turma *</span>
          <select
            value={turmaIdTurma}
            onChange={(evento) => setTurmaIdTurma(Number(evento.target.value))}
          >
            {turmas.length === 0 && <option value={0}>Nenhuma turma cadastrada</option>}
            {turmas.map((turma) => (
              <option key={turma.idTurma} value={turma.idTurma}>
                {turma.nomeTurma} ({turma.anoLetivo})
              </option>
            ))}
          </select>
        </label>

        <label className="formulario-grade__campo formulario-grade__campo--largo">
          <span>Matéria *</span>
          <select
            value={materiaIdMateria}
            onChange={(evento) => setMateriaIdMateria(Number(evento.target.value))}
          >
            {materias.length === 0 && <option value={0}>Nenhuma matéria cadastrada</option>}
            {materias.map((materia) => (
              <option key={materia.idMateria} value={materia.idMateria}>
                {materia.nomeMateria}
              </option>
            ))}
          </select>
        </label>

        <label className="formulario-grade__campo formulario-grade__campo--largo">
          <span>Professor *</span>
          <select
            value={professorIdProfessor}
            onChange={(evento) => setProfessorIdProfessor(Number(evento.target.value))}
          >
            {professores.length === 0 && <option value={0}>Nenhum professor cadastrado</option>}
            {professores.map((professor) => (
              <option key={professor.idProfessor} value={professor.idProfessor}>
                {professor.nomeProf}
              </option>
            ))}
          </select>
        </label>

        <label className="formulario-grade__campo">
          <span>Ano letivo *</span>
          <input
            type="number"
            value={anoLetivo}
            onChange={(evento) => setAnoLetivo(Number(evento.target.value))}
            min={2000}
            max={2100}
          />
        </label>

        <label className="formulario-grade__campo">
          <span>Carga horária semanal (h)</span>
          <input
            type="number"
            value={cargaHorariaSemanal}
            onChange={(evento) => setCargaHorariaSemanal(evento.target.value)}
            min={0}
            placeholder="Opcional"
          />
        </label>

        {erro && (
          <p className="formulario-grade__erro" role="alert">
            {erro}
          </p>
        )}

        <div className="formulario-grade__acoes">
          <button type="button" className="formulario-grade__botao-cancelar" onClick={cancelar}>
            Cancelar
          </button>
          <button type="submit" className="formulario-grade__botao-salvar">
            {gradeEditando ? "Salvar alterações" : "Cadastrar grade"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioGrade;
