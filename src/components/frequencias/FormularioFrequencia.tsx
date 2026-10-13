import { useRef, useState, type FormEvent } from "react";
import type {
  Frequencia,
  FrequenciaEntrada,
  SituacaoFrequencia,
  Aluno,
  GradeCurricular,
  Materia,
  Turma,
} from "../../types";
import "./FormularioFrequencia.css";

interface FormularioFrequenciaProps {
  frequenciaEditando?: Frequencia | null;
  alunos: Aluno[];
  grades: GradeCurricular[];
  materias: Materia[];
  turmas: Turma[];
  salvar: (dados: FrequenciaEntrada) => Promise<void> | void;
  cancelar: () => void;
}

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

function rotuloGrade(grade: GradeCurricular, materias: Materia[], turmas: Turma[]): string {
  const materia = materias.find((item) => item.idMateria === grade.materiaId);
  const turma = turmas.find((item) => item.idTurma === grade.turmaId);
  return `${materia?.nomeMateria ?? "Matéria"} — ${turma?.nomeTurma ?? "Turma"}`;
}

function FormularioFrequencia({
  frequenciaEditando,
  alunos,
  grades,
  materias,
  turmas,
  salvar,
  cancelar,
}: FormularioFrequenciaProps) {
  const [alunoId, setAlunoId] = useState<number>(
    frequenciaEditando?.alunoId ?? alunos[0]?.idAluno ?? 0
  );
  const [gradeId, setGradeId] = useState<number>(
    frequenciaEditando?.gradeId ?? grades[0]?.idGrade ?? 0
  );
  const [dataFrequencia, setDataFrequencia] = useState(
    frequenciaEditando?.dataFrequencia ?? hoje()
  );
  const [situacao, setSituacao] = useState<SituacaoFrequencia>(
    frequenciaEditando?.situacao ?? "Presente"
  );
  const [justificativa, setJustificativa] = useState(
    frequenciaEditando?.justificativa ?? ""
  );
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const emEnvioRef = useRef(false);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (emEnvioRef.current || enviando) return;

    if (!alunoId || !gradeId || !dataFrequencia) {
      setErro("Aluno, disciplina e data da aula são obrigatórios.");
      return;
    }

    if (situacao === "FaltaJustificada" && !justificativa.trim()) {
      setErro("Informe a justificativa para uma falta justificada.");
      return;
    }

    emEnvioRef.current = true;
    setEnviando(true);
    setErro(null);

    try {
      await salvar({
        alunoId: Number(alunoId),
        gradeId: Number(gradeId),
        dataFrequencia,
        situacao,
        justificativa:
          situacao === "FaltaJustificada"
            ? justificativa.trim()
            : justificativa.trim() || null,
      });
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Não foi possível registrar a frequência.");
    } finally {
      emEnvioRef.current = false;
      setEnviando(false);
    }
  }

  return (
    <section className="formulario-frequencia">
      <header className="formulario-frequencia__cabecalho">
        <h2>{frequenciaEditando ? "Editar Frequência" : "Nova Frequência"}</h2>
      </header>

      <form className="formulario-frequencia__form" onSubmit={handleSubmit} noValidate>
        <label className="formulario-frequencia__campo formulario-frequencia__campo--largo">
          <span>Aluno *</span>
          <select
            value={alunoId}
            onChange={(evento) => setAlunoId(Number(evento.target.value))}
            disabled={enviando}
          >
            {alunos.length === 0 && <option value={0}>Nenhum aluno cadastrado</option>}
            {alunos.map((aluno) => (
              <option key={aluno.idAluno} value={aluno.idAluno}>
                {aluno.nomeAluno} — Matrícula {aluno.numeroMatricula}
              </option>
            ))}
          </select>
        </label>

        <label className="formulario-frequencia__campo formulario-frequencia__campo--largo">
          <span>Disciplina (Grade Curricular) *</span>
          <select
            value={gradeId}
            onChange={(evento) => setGradeId(Number(evento.target.value))}
            disabled={enviando}
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
            value={dataFrequencia}
            onChange={(evento) => setDataFrequencia(evento.target.value)}
            disabled={enviando}
          />
        </label>

        <label className="formulario-frequencia__campo">
          <span>Situação *</span>
          <select
            value={situacao}
            onChange={(evento) => setSituacao(evento.target.value as SituacaoFrequencia)}
            disabled={enviando}
          >
            <option value="Presente">Presente</option>
            <option value="Falta">Ausente</option>
            <option value="FaltaJustificada">Justificado</option>
          </select>
        </label>

        <label className="formulario-frequencia__campo formulario-frequencia__campo--largo">
          <span>Justificativa{situacao === "FaltaJustificada" ? " *" : ""}</span>
          <textarea
            value={justificativa}
            onChange={(evento) => setJustificativa(evento.target.value)}
            disabled={enviando}
            placeholder={
              situacao === "FaltaJustificada"
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
            disabled={enviando}
          >
            Cancelar
          </button>
          <button type="submit" className="formulario-frequencia__botao-salvar" disabled={enviando}>
            {enviando ? "Salvando..." : frequenciaEditando ? "Salvar alterações" : "Registrar frequência"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioFrequencia;