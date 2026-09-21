import { useState, type FormEvent } from "react";
import type { Nota, NotaEntrada, Matricula, Aluno, Avaliacao, GradeCurricular, Materia, Turma } from "../../types";
import "./FormularioNota.css";

interface FormularioNotaProps {
  notaEditando?: Nota | null;
  /** Matrículas cadastradas, para o <select> de aluno. */
  matriculas: Matricula[];
  alunos: Aluno[];
  /** Avaliações cadastradas, para o <select> de avaliação. */
  avaliacoes: Avaliacao[];
  grades: GradeCurricular[];
  materias: Materia[];
  turmas: Turma[];
  /**
   * Espelha a constraint `uq_nota_matricula_avaliacao`: recebe a combinação
   * candidata de matrícula+avaliação e deve responder se já existe outra
   * nota com esse par (a que está sendo editada não conta).
   */
  existeNotaDuplicada: (matriculaIdMatricula: number, avaliacaoIdAvaliacao: number) => boolean;
  salvar: (dados: NotaEntrada) => void;
  cancelar: () => void;
}

function rotuloMatricula(matricula: Matricula, alunos: Aluno[]): string {
  const aluno = alunos.find((item) => item.idAluno === matricula.alunoIdAluno);
  return aluno ? `${aluno.nomeAluno} — Matrícula ${aluno.numeroMatricula}` : `Matrícula ${matricula.idMatricula}`;
}

function rotuloAvaliacao(
  avaliacao: Avaliacao,
  grades: GradeCurricular[],
  materias: Materia[],
  turmas: Turma[]
): string {
  const grade = grades.find((item) => item.idGrade === avaliacao.gradeIdGrade);
  const materia = grade ? materias.find((item) => item.idMateria === grade.materiaIdMateria) : undefined;
  const turma = grade ? turmas.find((item) => item.idTurma === grade.turmaIdTurma) : undefined;
  const contexto = [materia?.nomeMateria, turma?.nomeTurma].filter(Boolean).join(" — ");
  return contexto ? `${avaliacao.nomeAvaliacao} (${contexto})` : avaliacao.nomeAvaliacao;
}

function FormularioNota({
  notaEditando,
  matriculas,
  alunos,
  avaliacoes,
  grades,
  materias,
  turmas,
  existeNotaDuplicada,
  salvar,
  cancelar,
}: FormularioNotaProps) {
  const [matriculaIdMatricula, setMatriculaIdMatricula] = useState(
    notaEditando?.matriculaIdMatricula ?? matriculas[0]?.idMatricula ?? 0
  );
  const [avaliacaoIdAvaliacao, setAvaliacaoIdAvaliacao] = useState(
    notaEditando?.avaliacaoIdAvaliacao ?? avaliacoes[0]?.idAvaliacao ?? 0
  );
  const [valorNota, setValorNota] = useState(notaEditando?.valorNota?.toString() ?? "");
  const [observacao, setObservacao] = useState(notaEditando?.observacao ?? "");
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!matriculaIdMatricula || !avaliacaoIdAvaliacao || valorNota === "") {
      setErro("Matrícula, avaliação e valor da nota são obrigatórios.");
      return;
    }

    const notaNumerica = Number(valorNota);
    if (Number.isNaN(notaNumerica) || notaNumerica < 0 || notaNumerica > 10) {
      setErro("A nota deve ser um valor entre 0.0 e 10.0.");
      return;
    }

    if (existeNotaDuplicada(Number(matriculaIdMatricula), Number(avaliacaoIdAvaliacao))) {
      const aluno = alunos.find(
        (item) =>
          item.idAluno ===
          matriculas.find((matricula) => matricula.idMatricula === Number(matriculaIdMatricula))?.alunoIdAluno
      );
      setErro(`${aluno?.nomeAluno ?? "Este aluno"} já tem uma nota lançada para essa avaliação.`);
      return;
    }

    setErro(null);
    salvar({
      matriculaIdMatricula: Number(matriculaIdMatricula),
      avaliacaoIdAvaliacao: Number(avaliacaoIdAvaliacao),
      valorNota: notaNumerica,
      observacao: observacao.trim() || undefined,
    });
  }

  return (
    <section className="formulario-nota">
      <header className="formulario-nota__cabecalho">
        <h2>{notaEditando ? "Editar Nota" : "Nova Nota"}</h2>
      </header>

      <form className="formulario-nota__form" onSubmit={handleSubmit} noValidate>
        <label className="formulario-nota__campo formulario-nota__campo--largo">
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

        <label className="formulario-nota__campo formulario-nota__campo--largo">
          <span>Avaliação *</span>
          <select
            value={avaliacaoIdAvaliacao}
            onChange={(evento) => setAvaliacaoIdAvaliacao(Number(evento.target.value))}
          >
            {avaliacoes.length === 0 && <option value={0}>Nenhuma avaliação cadastrada</option>}
            {avaliacoes.map((avaliacao) => (
              <option key={avaliacao.idAvaliacao} value={avaliacao.idAvaliacao}>
                {rotuloAvaliacao(avaliacao, grades, materias, turmas)}
              </option>
            ))}
          </select>
        </label>

        <label className="formulario-nota__campo">
          <span>Nota (0.0 a 10.0) *</span>
          <input
            type="number"
            value={valorNota}
            onChange={(evento) => setValorNota(evento.target.value)}
            min="0"
            max="10"
            step="0.1"
            placeholder="Ex.: 8.5"
          />
        </label>

        <label className="formulario-nota__campo formulario-nota__campo--largo">
          <span>Observação</span>
          <textarea
            value={observacao}
            onChange={(evento) => setObservacao(evento.target.value)}
            placeholder="Opcional"
            rows={3}
          />
        </label>

        {erro && (
          <p className="formulario-nota__erro" role="alert">
            {erro}
          </p>
        )}

        <div className="formulario-nota__acoes">
          <button type="button" className="formulario-nota__botao-cancelar" onClick={cancelar}>
            Cancelar
          </button>
          <button type="submit" className="formulario-nota__botao-salvar">
            {notaEditando ? "Salvar alterações" : "Lançar nota"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioNota;
