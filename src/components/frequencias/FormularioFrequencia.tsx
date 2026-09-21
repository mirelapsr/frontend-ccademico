import { useState, type FormEvent } from "react";
import type {
  Frequencia,
  FrequenciaEntrada,
  StatusFrequencia,
  Matricula,
  Aluno,
  GradeCurricular,
  Materia,
  Turma,
} from "../../types";
import "./FormularioFrequencia.css";

interface FormularioFrequenciaProps {
  frequenciaEditando?: Frequencia | null;
  /** Matrículas cadastradas, para o <select> de aluno. */
  matriculas: Matricula[];
  alunos: Aluno[];
  /** Grades curriculares cadastradas, para o <select> de disciplina. */
  grades: GradeCurricular[];
  materias: Materia[];
  turmas: Turma[];
  salvar: (dados: FrequenciaEntrada) => void;
  cancelar: () => void;
}

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

function rotuloMatricula(matricula: Matricula, alunos: Aluno[]): string {
  const aluno = alunos.find((item) => item.idAluno === matricula.alunoIdAluno);
  return aluno ? `${aluno.nomeAluno} — Matrícula ${aluno.numeroMatricula}` : `Matrícula ${matricula.idMatricula}`;
}

function rotuloGrade(grade: GradeCurricular, materias: Materia[], turmas: Turma[]): string {
  const materia = materias.find((item) => item.idMateria === grade.materiaIdMateria);
  const turma = turmas.find((item) => item.idTurma === grade.turmaIdTurma);
  return `${materia?.nomeMateria ?? "Matéria"} — ${turma?.nomeTurma ?? "Turma"}`;
}

function FormularioFrequencia({
  frequenciaEditando,
  matriculas,
  alunos,
  grades,
  materias,
  turmas,
  salvar,
  cancelar,
}: FormularioFrequenciaProps) {
  const [matriculaIdMatricula, setMatriculaIdMatricula] = useState(
    frequenciaEditando?.matriculaIdMatricula ?? matriculas[0]?.idMatricula ?? 0
  );
  const [gradeIdGrade, setGradeIdGrade] = useState(
    frequenciaEditando?.gradeIdGrade ?? grades[0]?.idGrade ?? 0
  );
  const [dataAula, setDataAula] = useState(frequenciaEditando?.dataAula ?? hoje());
  const [status, setStatus] = useState<StatusFrequencia>(frequenciaEditando?.status ?? "Presente");
  const [justificativa, setJustificativa] = useState(frequenciaEditando?.justificativa ?? "");
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!matriculaIdMatricula || !gradeIdGrade || !dataAula) {
      setErro("Matrícula, disciplina e data da aula são obrigatórios.");
      return;
    }

    if (status === "Justificado" && !justificativa.trim()) {
      setErro("Informe a justificativa para uma falta justificada.");
      return;
    }

    setErro(null);
    salvar({
      matriculaIdMatricula: Number(matriculaIdMatricula),
      gradeIdGrade: Number(gradeIdGrade),
      dataAula,
      status,
      justificativa: status === "Justificado" ? justificativa.trim() : justificativa.trim() || undefined,
    });
  }

  return (
    <section className="formulario-frequencia">
      <header className="formulario-frequencia__cabecalho">
        <h2>{frequenciaEditando ? "Editar Frequência" : "Nova Frequência"}</h2>
      </header>

      <form className="formulario-frequencia__form" onSubmit={handleSubmit} noValidate>
        <label className="formulario-frequencia__campo formulario-frequencia__campo--largo">
          <span>Aluno (Matrícula) *</span>
          <select
            value={matriculaIdMatricula}
            onChange={(evento) => setMatriculaIdMatricula(Number(evento.target.value))}
          >
            {matriculas.length === 0 && <option value={0}>Nenhuma matrícula cadastrada</option>}
            {matriculas.map((matricula) => (
              <option key={matricula.idMatricula} value={matricula.idMatricula}>
                {rotuloMatricula(matricula, alunos)}
              </option>
            ))}
          </select>
        </label>

        <label className="formulario-frequencia__campo formulario-frequencia__campo--largo">
          <span>Disciplina (Grade Curricular) *</span>
          <select
            value={gradeIdGrade}
            onChange={(evento) => setGradeIdGrade(Number(evento.target.value))}
          >
            {grades.length === 0 && <option value={0}>Nenhuma grade cadastrada</option>}
            {grades.map((grade) => (
              <option key={grade.idGrade} value={grade.idGrade}>
                {rotuloGrade(grade, materias, turmas)}
              </option>
            ))}
          </select>
        </label>

        <label className="formulario-frequencia__campo">
          <span>Data da aula *</span>
          <input
            type="date"
            value={dataAula}
            onChange={(evento) => setDataAula(evento.target.value)}
          />
        </label>

        <label className="formulario-frequencia__campo">
          <span>Status *</span>
          <select
            value={status}
            onChange={(evento) => setStatus(evento.target.value as StatusFrequencia)}
          >
            <option value="Presente">Presente</option>
            <option value="Ausente">Ausente</option>
            <option value="Justificado">Justificado</option>
          </select>
        </label>

        <label className="formulario-frequencia__campo formulario-frequencia__campo--largo">
          <span>Justificativa{status === "Justificado" ? " *" : ""}</span>
          <textarea
            value={justificativa}
            onChange={(evento) => setJustificativa(evento.target.value)}
            placeholder={
              status === "Justificado"
                ? "Descreva o motivo da falta justificada..."
                : "Opcional"
            }
            rows={3}
          />
        </label>

        {erro && (
          <p className="formulario-frequencia__erro" role="alert">
            {erro}
          </p>
        )}

        <div className="formulario-frequencia__acoes">
          <button
            type="button"
            className="formulario-frequencia__botao-cancelar"
            onClick={cancelar}
          >
            Cancelar
          </button>
          <button type="submit" className="formulario-frequencia__botao-salvar">
            {frequenciaEditando ? "Salvar alterações" : "Registrar frequência"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioFrequencia;
