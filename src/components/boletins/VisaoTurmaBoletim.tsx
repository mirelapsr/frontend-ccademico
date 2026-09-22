import { useMemo } from "react";
import type { Aluno, Frequencia, GradeCurricular, Matricula, Periodo, Turma } from "../../types";
import { contarFaltas } from "../../utils/boletim";
import "./VisaoTurmaBoletim.css";

interface VisaoTurmaBoletimProps {
  turmas: Turma[];
  periodos: Periodo[];
  matriculas: Matricula[];
  alunos: Aluno[];
  grades: GradeCurricular[];
  frequencias: Frequencia[];
  turmaId: number | null;
  periodoId: number | null;
  aoMudarTurma: (idTurma: number | null) => void;
  aoMudarPeriodo: (idPeriodo: number | null) => void;
  aoAbrirBoletim: (idMatricula: number) => void;
}

export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

function VisaoTurmaBoletim({
  turmas,
  periodos,
  matriculas,
  alunos,
  grades,
  frequencias,
  turmaId,
  periodoId,
  aoMudarTurma,
  aoMudarPeriodo,
  aoAbrirBoletim,
}: VisaoTurmaBoletimProps) {
  const periodo = periodos.find((item) => item.idPeriodo === periodoId) ?? null;

  const cartoes = useMemo(() => {
    if (turmaId === null) return [];
    const idsGradeDaTurma = new Set(
      grades.filter((grade) => grade.turmaIdTurma === turmaId).map((grade) => grade.idGrade)
    );

    return matriculas
      .filter((matricula) => matricula.turmaIdTurma === turmaId && matricula.situacao === "Ativa")
      .flatMap((matricula) => {
        const aluno = alunos.find((item) => item.idAluno === matricula.alunoIdAluno);
        if (!aluno) return [];
        const faltas = periodo
          ? contarFaltas(frequencias, matricula.idMatricula, idsGradeDaTurma, periodo)
          : 0;
        return [{ matricula, aluno, faltas }];
      })
      .sort((a, b) => a.aluno.nomeAluno.localeCompare(b.aluno.nomeAluno, "pt-BR"));
  }, [turmaId, matriculas, alunos, grades, frequencias, periodo]);

  return (
    <section className="visao-turma">
      <header className="visao-turma__cabecalho">
        <h2>Boletim Escolar</h2>
      </header>

      <div className="visao-turma__filtros">
        <label className="visao-turma__campo">
          <span>Turma</span>
          <select
            value={turmaId ?? ""}
            onChange={(evento) => aoMudarTurma(evento.target.value === "" ? null : Number(evento.target.value))}
          >
            <option value="">Selecione a turma</option>
            {turmas.map((turma) => (
              <option key={turma.idTurma} value={turma.idTurma}>
                {turma.nomeTurma} ({turma.anoLetivo})
              </option>
            ))}
          </select>
        </label>

        <label className="visao-turma__campo">
          <span>Período letivo</span>
          <select
            value={periodoId ?? ""}
            onChange={(evento) => aoMudarPeriodo(evento.target.value === "" ? null : Number(evento.target.value))}
          >
            <option value="">Selecione o período</option>
            {periodos.map((item) => (
              <option key={item.idPeriodo} value={item.idPeriodo}>
                {item.nomePeriodo} ({item.ano})
              </option>
            ))}
          </select>
        </label>
      </div>

      {turmaId === null || periodo === null ? (
        <p className="visao-turma__vazio">Escolha uma turma e um período letivo para ver os alunos.</p>
      ) : cartoes.length === 0 ? (
        <p className="visao-turma__vazio">Nenhum aluno com matrícula ativa nesta turma.</p>
      ) : (
        <ul className="visao-turma__grade">
          {cartoes.map(({ matricula, aluno, faltas }) => (
            <li key={matricula.idMatricula} className="visao-turma__cartao">
              <div className="visao-turma__avatar" aria-hidden="true">
                {iniciais(aluno.nomeAluno)}
              </div>
              <div className="visao-turma__identificacao">
                <h3>{aluno.nomeAluno}</h3>
                <p>Matrícula {aluno.numeroMatricula}</p>
              </div>
              <p
                className={`visao-turma__faltas${faltas > 0 ? " visao-turma__faltas--com-faltas" : ""}`}
                title="Faltas no período selecionado"
              >
                <strong>{faltas}</strong> {faltas === 1 ? "falta" : "faltas"} no período
              </p>
              <button
                type="button"
                className="visao-turma__botao"
                onClick={() => aoAbrirBoletim(matricula.idMatricula)}
              >
                Editar Boletim
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default VisaoTurmaBoletim;
