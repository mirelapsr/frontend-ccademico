import { useState, type FormEvent } from "react";
import type { Aluno, Matricula, MatriculaEntrada, SituacaoMatricula, Turma } from "../../types";
import "./FormularioMatricula.css";

interface FormularioMatriculaProps {
  matriculaEditando?: Matricula | null;
  /** Alunos cadastrados, para o <select> de aluno. */
  alunos: Aluno[];
  /** Turmas disponíveis, para o <select> de turma. */
  turmas: Turma[];
  /**
   * Espelha a regra do trigger `func_matricula_unica_ativa_ins/upd`: recebe
   * o `alunoIdAluno` candidato e deve responder se já existe, para esse
   * aluno, outra matrícula com `situacao === "Ativa"` (a que está sendo
   * editada não conta). Só é chamada quando a situação escolhida é "Ativa".
   */
  existeOutraMatriculaAtiva: (alunoIdAluno: number) => boolean;
  salvar: (dados: MatriculaEntrada) => void;
  cancelar: () => void;
}

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

function FormularioMatricula({
  matriculaEditando,
  alunos,
  turmas,
  existeOutraMatriculaAtiva,
  salvar,
  cancelar,
}: FormularioMatriculaProps) {
  const [alunoIdAluno, setAlunoIdAluno] = useState(
    matriculaEditando?.alunoIdAluno ?? alunos[0]?.idAluno ?? 0
  );
  const [turmaIdTurma, setTurmaIdTurma] = useState(
    matriculaEditando?.turmaIdTurma ?? turmas[0]?.idTurma ?? 0
  );
  const [dataMatricula, setDataMatricula] = useState(
    matriculaEditando?.dataMatricula ?? hoje()
  );
  const [situacao, setSituacao] = useState<SituacaoMatricula>(
    matriculaEditando?.situacao ?? "Ativa"
  );
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!alunoIdAluno || !turmaIdTurma || !dataMatricula) {
      setErro("Aluno, turma e data da matrícula são obrigatórios.");
      return;
    }

    if (situacao === "Ativa" && existeOutraMatriculaAtiva(Number(alunoIdAluno))) {
      const aluno = alunos.find((item) => item.idAluno === Number(alunoIdAluno));
      setErro(
        `${aluno?.nomeAluno ?? "Este aluno"} já possui uma matrícula ativa. ` +
          "Encerre ou transfira a matrícula atual antes de criar outra."
      );
      return;
    }

    setErro(null);
    salvar({
      alunoIdAluno: Number(alunoIdAluno),
      turmaIdTurma: Number(turmaIdTurma),
      dataMatricula,
      situacao,
    });
  }

  return (
    <section className="formulario-matricula">
      <header className="formulario-matricula__cabecalho">
        <h2>{matriculaEditando ? "Editar Matrícula" : "Nova Matrícula"}</h2>
      </header>

      <form className="formulario-matricula__form" onSubmit={handleSubmit} noValidate>
        <label className="formulario-matricula__campo formulario-matricula__campo--largo">
          <span>Aluno *</span>
          <select
            value={alunoIdAluno}
            onChange={(evento) => setAlunoIdAluno(Number(evento.target.value))}
          >
            {alunos.length === 0 && <option value={0}>Nenhum aluno cadastrado</option>}
            {alunos.map((aluno) => (
              <option key={aluno.idAluno} value={aluno.idAluno}>
                {aluno.nomeAluno} — Matrícula {aluno.numeroMatricula}
              </option>
            ))}
          </select>
        </label>

        <label className="formulario-matricula__campo formulario-matricula__campo--largo">
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

        <label className="formulario-matricula__campo">
          <span>Data da matrícula *</span>
          <input
            type="date"
            value={dataMatricula}
            onChange={(evento) => setDataMatricula(evento.target.value)}
          />
        </label>

        <label className="formulario-matricula__campo">
          <span>Situação *</span>
          <select
            value={situacao}
            onChange={(evento) => setSituacao(evento.target.value as SituacaoMatricula)}
          >
            <option value="Ativa">Ativa</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Transferida">Transferida</option>
            <option value="Concluida">Concluída</option>
          </select>
        </label>

        {erro && (
          <p className="formulario-matricula__erro" role="alert">
            {erro}
          </p>
        )}

        <div className="formulario-matricula__acoes">
          <button
            type="button"
            className="formulario-matricula__botao-cancelar"
            onClick={cancelar}
          >
            Cancelar
          </button>
          <button type="submit" className="formulario-matricula__botao-salvar">
            {matriculaEditando ? "Salvar alterações" : "Cadastrar matrícula"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioMatricula;
