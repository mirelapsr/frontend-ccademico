import { useRef, useState, type FormEvent } from "react";
import type {
  Nota,
  NotaEntrada,
  Aluno,
  Avaliacao,
  GradeCurricular,
  Materia,
  Turma,
} from "../../types";
import "./FormularioNota.css";

interface FormularioNotaProps {
  notaEditando?: Nota | null;
  alunos: Aluno[];
  avaliacoes: Avaliacao[];
  grades: GradeCurricular[];
  materias: Materia[];
  turmas: Turma[];
  existeNotaDuplicada: (alunoId: number, avaliacaoId: number) => boolean;
  salvar: (dados: NotaEntrada) => Promise<void> | void;
  cancelar: () => void;
}

function rotuloAvaliacao(
  avaliacao: Avaliacao,
  grades: GradeCurricular[],
  materias: Materia[],
  turmas: Turma[]
): string {
  const grade = grades.find((item) => item.idGrade === avaliacao.gradeId);
  const materia = grade ? materias.find((item) => item.idMateria === grade.materiaId) : undefined;
  const turma = grade ? turmas.find((item) => item.idTurma === grade.turmaId) : undefined;
  const contexto = [materia?.nomeMateria, turma?.nomeTurma].filter(Boolean).join(" — ");
  return contexto ? `${avaliacao.nomeAvaliacao} (${contexto})` : avaliacao.nomeAvaliacao;
}

function FormularioNota({
  notaEditando,
  alunos,
  avaliacoes,
  grades,
  materias,
  turmas,
  existeNotaDuplicada,
  salvar,
  cancelar,
}: FormularioNotaProps) {
  const [alunoId, setAlunoId] = useState<number>(
    notaEditando?.alunoId ?? alunos[0]?.idAluno ?? 0
  );
  const [avaliacaoId, setAvaliacaoId] = useState<number>(
    notaEditando?.avaliacaoId ?? avaliacoes[0]?.idAvaliacao ?? 0
  );
  const [valorNota, setValorNota] = useState(notaEditando?.valorNota?.toString() ?? "");
  const [observacao, setObservacao] = useState(notaEditando?.observacao ?? "");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const emEnvioRef = useRef(false);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (emEnvioRef.current || enviando) return;

    if (!alunoId || !avaliacaoId || valorNota.trim() === "") {
      setErro("Aluno, avaliação e valor da nota são obrigatórios.");
      return;
    }

    const notaNumerica = Number(valorNota.replace(",", "."));
    if (Number.isNaN(notaNumerica) || notaNumerica < 0 || notaNumerica > 10) {
      setErro("A nota deve ser um valor entre 0.0 e 10.0.");
      return;
    }

    if (existeNotaDuplicada(Number(alunoId), Number(avaliacaoId))) {
      const aluno = alunos.find((item) => item.idAluno === Number(alunoId));
      setErro(`${aluno?.nomeAluno ?? "Este aluno"} já tem uma nota lançada para essa avaliação.`);
      return;
    }

    emEnvioRef.current = true;
    setEnviando(true);
    setErro(null);

    try {
      await salvar({
        alunoId: Number(alunoId),
        avaliacaoId: Number(avaliacaoId),
        valorNota: String(notaNumerica),
        observacao: observacao.trim() || undefined,
      });
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar a nota.");
    } finally {
      emEnvioRef.current = false;
      setEnviando(false);
    }
  }

  return (
    <section className="formulario-nota">
      <header className="formulario-nota__cabecalho">
        <h2>{notaEditando ? "Editar Nota" : "Nova Nota"}</h2>
      </header>

      <form className="formulario-nota__form" onSubmit={handleSubmit} noValidate>
        <label className="formulario-nota__campo formulario-nota__campo--largo">
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

        <label className="formulario-nota__campo formulario-nota__campo--largo">
          <span>Avaliação *</span>
          <select
            value={avaliacaoId}
            onChange={(evento) => setAvaliacaoId(Number(evento.target.value))}
            disabled={enviando}
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
            disabled={enviando}
          />
        </label>

        <label className="formulario-nota__campo formulario-nota__campo--largo">
          <span>Observação</span>
          <textarea
            value={observacao}
            onChange={(evento) => setObservacao(evento.target.value)}
            placeholder="Opcional"
            rows={3}
            disabled={enviando}
          />
        </label>

        {erro && (
          <p className="formulario-nota__erro" role="alert">
            {erro}
          </p>
        )}

        <div className="formulario-nota__acoes">
          <button
            type="button"
            className="formulario-nota__botao-cancelar"
            onClick={cancelar}
            disabled={enviando}
          >
            Cancelar
          </button>
          <button type="submit" className="formulario-nota__botao-salvar" disabled={enviando}>
            {enviando ? "Salvando..." : notaEditando ? "Salvar alterações" : "Lançar nota"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioNota;