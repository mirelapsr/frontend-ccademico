import { useState, type FormEvent } from "react";
import type { Boletim, BoletimEntrada, SituacaoBoletim, Matricula, Aluno, Periodo } from "../../types";
import "./FormularioBoletim.css";

interface FormularioBoletimProps {
  boletimEditando?: Boletim | null;
  /** Matrículas cadastradas, para o <select> de aluno. */
  matriculas: Matricula[];
  alunos: Aluno[];
  /** Períodos letivos cadastrados, para o <select> de período. */
  periodos: Periodo[];
  /**
   * Espelha a constraint `uq_boletim_matricula_periodo`: recebe a
   * combinação candidata de matrícula+período e deve responder se já existe
   * outro boletim com esse par (o que está sendo editado não conta).
   */
  existeBoletimDuplicado: (matriculaIdMatricula: number, periodoIdPeriodo: number) => boolean;
  salvar: (dados: BoletimEntrada) => void;
  cancelar: () => void;
}

function rotuloMatricula(matricula: Matricula, alunos: Aluno[]): string {
  const aluno = alunos.find((item) => item.idAluno === matricula.alunoIdAluno);
  return aluno ? `${aluno.nomeAluno} — Matrícula ${aluno.numeroMatricula}` : `Matrícula ${matricula.idMatricula}`;
}

function FormularioBoletim({
  boletimEditando,
  matriculas,
  alunos,
  periodos,
  existeBoletimDuplicado,
  salvar,
  cancelar,
}: FormularioBoletimProps) {
  const [matriculaIdMatricula, setMatriculaIdMatricula] = useState(
    boletimEditando?.matriculaIdMatricula ?? matriculas[0]?.idMatricula ?? 0
  );
  const [periodoIdPeriodo, setPeriodoIdPeriodo] = useState(
    boletimEditando?.periodoIdPeriodo ?? periodos[0]?.idPeriodo ?? 0
  );
  const [mediaFinal, setMediaFinal] = useState(boletimEditando?.mediaFinal?.toString() ?? "");
  const [totalFaltas, setTotalFaltas] = useState(boletimEditando?.totalFaltas?.toString() ?? "0");
  const [situacao, setSituacao] = useState<SituacaoBoletim>(
    boletimEditando?.situacao ?? "Em Andamento"
  );
  const [observacoes, setObservacoes] = useState(boletimEditando?.observacoes ?? "");
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!matriculaIdMatricula || !periodoIdPeriodo) {
      setErro("Aluno (matrícula) e período letivo são obrigatórios.");
      return;
    }

    const mediaNumerica = mediaFinal === "" ? null : Number(mediaFinal);
    if (mediaNumerica !== null && (Number.isNaN(mediaNumerica) || mediaNumerica < 0 || mediaNumerica > 10)) {
      setErro("A média final deve ser um valor entre 0.0 e 10.0, ou ficar em branco.");
      return;
    }

    if (existeBoletimDuplicado(Number(matriculaIdMatricula), Number(periodoIdPeriodo))) {
      const aluno = alunos.find(
        (item) =>
          item.idAluno ===
          matriculas.find((matricula) => matricula.idMatricula === Number(matriculaIdMatricula))?.alunoIdAluno
      );
      setErro(`${aluno?.nomeAluno ?? "Este aluno"} já tem um boletim lançado para esse período.`);
      return;
    }

    setErro(null);
    salvar({
      matriculaIdMatricula: Number(matriculaIdMatricula),
      periodoIdPeriodo: Number(periodoIdPeriodo),
      mediaFinal: mediaNumerica,
      totalFaltas: totalFaltas === "" ? 0 : Number(totalFaltas),
      situacao,
      observacoes: observacoes.trim() || undefined,
    });
  }

  return (
    <section className="formulario-boletim">
      <header className="formulario-boletim__cabecalho">
        <h2>{boletimEditando ? "Editar Boletim" : "Novo Boletim"}</h2>
      </header>

      <form className="formulario-boletim__form" onSubmit={handleSubmit} noValidate>
        <label className="formulario-boletim__campo formulario-boletim__campo--largo">
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

        <label className="formulario-boletim__campo formulario-boletim__campo--largo">
          <span>Período letivo *</span>
          <select
            value={periodoIdPeriodo}
            onChange={(evento) => setPeriodoIdPeriodo(Number(evento.target.value))}
          >
            {periodos.length === 0 && <option value={0}>Nenhum período cadastrado</option>}
            {periodos.map((periodo) => (
              <option key={periodo.idPeriodo} value={periodo.idPeriodo}>
                {periodo.nomePeriodo} ({periodo.ano})
              </option>
            ))}
          </select>
        </label>

        <label className="formulario-boletim__campo">
          <span>Média final (0.0 a 10.0)</span>
          <input
            type="number"
            value={mediaFinal}
            onChange={(evento) => setMediaFinal(evento.target.value)}
            min="0"
            max="10"
            step="0.1"
            placeholder="Deixe em branco se ainda não fechou"
          />
        </label>

        <label className="formulario-boletim__campo">
          <span>Total de faltas</span>
          <input
            type="number"
            value={totalFaltas}
            onChange={(evento) => setTotalFaltas(evento.target.value)}
            min={0}
          />
        </label>

        <label className="formulario-boletim__campo">
          <span>Situação *</span>
          <select
            value={situacao}
            onChange={(evento) => setSituacao(evento.target.value as SituacaoBoletim)}
          >
            <option value="Em Andamento">Em Andamento</option>
            <option value="Aprovado">Aprovado</option>
            <option value="Recuperacao">Recuperação</option>
            <option value="Reprovado">Reprovado</option>
          </select>
        </label>

        <label className="formulario-boletim__campo formulario-boletim__campo--largo">
          <span>Observações</span>
          <textarea
            value={observacoes}
            onChange={(evento) => setObservacoes(evento.target.value)}
            placeholder="Opcional"
            rows={3}
          />
        </label>

        {erro && (
          <p className="formulario-boletim__erro" role="alert">
            {erro}
          </p>
        )}

        <div className="formulario-boletim__acoes">
          <button
            type="button"
            className="formulario-boletim__botao-cancelar"
            onClick={cancelar}
          >
            Cancelar
          </button>
          <button type="submit" className="formulario-boletim__botao-salvar">
            {boletimEditando ? "Salvar alterações" : "Lançar boletim"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioBoletim;
