import { useRef, useState, type FormEvent } from "react";
import type { Aluno, Matricula, MatriculaEntrada, SituacaoMatricula, Turma } from "../../types";
import "./FormularioMatricula.css";

interface FormularioMatriculaProps {
  matriculaEditando?: Matricula | null;
  alunos: Aluno[];
  turmas: Turma[];

  existeOutraMatriculaAtiva: (alunoId: number) => boolean;
  salvar: (dados: MatriculaEntrada) => Promise<void> | void;
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
  const [alunoId, setAlunoId] = useState(
    matriculaEditando?.alunoId ?? alunos[0]?.idAluno ?? 0
  );
  const [turmaId, setTurmaId] = useState(
    matriculaEditando?.turmaId ?? turmas[0]?.idTurma ?? 0
  );
  const [dataMatricula, setDataMatricula] = useState(
    matriculaEditando?.dataMatricula ?? hoje()
  );
  const [situacao, setSituacao] = useState<SituacaoMatricula>(
    matriculaEditando?.situacao ?? "Ativa"
  );
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const emEnvioRef = useRef(false);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (emEnvioRef.current || enviando) return;

    if (!alunoId || !turmaId || !dataMatricula) {
      setErro("Aluno, turma e data da matrícula são obrigatórios.");
      return;
    }

    if (situacao === "Ativa" && existeOutraMatriculaAtiva(Number(alunoId))) {
      const aluno = alunos.find((item) => item.idAluno === Number(alunoId));
      setErro(
        `${aluno?.nomeAluno ?? "Este aluno"} já possui uma matrícula ativa. ` +
          "Encerre ou transfira a matrícula atual antes de criar outra."
      );
      return;
    }

    emEnvioRef.current = true;
    setEnviando(true);
    setErro(null);

    try {
      await salvar({
        alunoId: Number(alunoId),
        turmaId: Number(turmaId),
        dataMatricula,
        situacao,
      });
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar a matrícula.");
    } finally {
      emEnvioRef.current = false;
      setEnviando(false);
    }
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

        <label className="formulario-matricula__campo formulario-matricula__campo--largo">
          <span>Turma *</span>
          <select
            value={turmaId}
            onChange={(evento) => setTurmaId(Number(evento.target.value))}
            disabled={enviando}
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
            disabled={enviando}
          />
        </label>

        <label className="formulario-matricula__campo">
          <span>Situação *</span>
          <select
            value={situacao}
            onChange={(evento) => setSituacao(evento.target.value as SituacaoMatricula)}
            disabled={enviando}
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
            disabled={enviando}
          >
            Cancelar
          </button>
          <button type="submit" className="formulario-matricula__botao-salvar" disabled={enviando}>
            {enviando ? "Salvando..." : matriculaEditando ? "Salvar alterações" : "Cadastrar matrícula"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioMatricula;