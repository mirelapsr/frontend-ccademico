import { useState } from "react";
import VisaoTurmaBoletim from "../components/boletins/VisaoTurmaBoletim";
import BoletimAluno, { type AlteracaoNota } from "../components/boletins/BoletimAluno";
import Toast, { type TipoToast } from "../components/ui/Toast";
import {
  alunosMock,
  avaliacoesMock,
  frequenciasMock,
  gradesCurricularesMock,
  materiasMock,
  matriculasMock,
  notasMock,
  periodosMock,
  turmasMock,
} from "../mock";
import { useColecaoPersistida } from "../hooks/useColecaoPersistida";
import { CHAVES_LOCALSTORAGE } from "../storage";
import type {
  Aluno,
  Avaliacao,
  Frequencia,
  GradeCurricular,
  Materia,
  Matricula,
  Nota,
  Periodo,
  Turma,
} from "../types";

/**
 * Boletim em dois níveis: (1) turma → cards dos alunos; (2) boletim do aluno
 * com edição inline das notas. A única coleção escrita aqui é `notas`.
 */
function PaginaBoletins() {
  const [notas, setNotas] = useColecaoPersistida<Nota>(CHAVES_LOCALSTORAGE.notas, notasMock);
  const [matriculas] = useColecaoPersistida<Matricula>(CHAVES_LOCALSTORAGE.matriculas, matriculasMock);
  const [alunos] = useColecaoPersistida<Aluno>(CHAVES_LOCALSTORAGE.alunos, alunosMock);
  const [turmas] = useColecaoPersistida<Turma>(CHAVES_LOCALSTORAGE.turmas, turmasMock);
  const [periodos] = useColecaoPersistida<Periodo>(CHAVES_LOCALSTORAGE.periodos, periodosMock);
  const [materias] = useColecaoPersistida<Materia>(CHAVES_LOCALSTORAGE.materias, materiasMock);
  const [grades] = useColecaoPersistida<GradeCurricular>(
    CHAVES_LOCALSTORAGE.gradesCurriculares,
    gradesCurricularesMock
  );
  const [avaliacoes] = useColecaoPersistida<Avaliacao>(CHAVES_LOCALSTORAGE.avaliacoes, avaliacoesMock);
  const [frequencias] = useColecaoPersistida<Frequencia>(CHAVES_LOCALSTORAGE.frequencias, frequenciasMock);

  const [turmaId, setTurmaId] = useState<number | null>(null);
  const [periodoId, setPeriodoId] = useState<number | null>(
    () => (periodos.find((periodo) => periodo.situacao === "Ativo") ?? periodos[0])?.idPeriodo ?? null
  );
  const [matriculaAberta, setMatriculaAberta] = useState<number | null>(null);
  const [toast, setToast] = useState<{ mensagem: string; tipo: TipoToast } | null>(null);

  function mudarTurma(idTurma: number | null) {
    setTurmaId(idTurma);
    setMatriculaAberta(null);
  }

  /**
   * Upsert por (matrícula, avaliação) — mesma regra de `uq_nota_matricula_avaliacao`:
   * atualiza a nota existente (mantendo o id), cria só se não existir e remove
   * quando o campo foi limpo. Nunca gera duplicata.
   */
  function salvarNotas(idMatricula: number, alteracoes: AlteracaoNota[]) {
    const novoValor = new Map(alteracoes.map((alteracao) => [alteracao.avaliacaoId, alteracao.valor]));
    const agora = new Date().toISOString();

    setNotas((atual) => {
      const jaTratadas = new Set<number>();

      const resultado = atual.flatMap((nota) => {
        if (nota.matriculaIdMatricula !== idMatricula || !novoValor.has(nota.avaliacaoIdAvaliacao)) {
          return [nota];
        }
        if (jaTratadas.has(nota.avaliacaoIdAvaliacao)) return []; // descarta duplicata pré-existente
        jaTratadas.add(nota.avaliacaoIdAvaliacao);

        const valor = novoValor.get(nota.avaliacaoIdAvaliacao) ?? null;
        return valor === null ? [] : [{ ...nota, valorNota: valor, atualizadoEm: agora }];
      });

      let proximoId = atual.reduce((maior, nota) => Math.max(maior, nota.idNota), 0) + 1;
      for (const [avaliacaoId, valor] of novoValor) {
        if (valor === null || jaTratadas.has(avaliacaoId)) continue;
        resultado.push({
          idNota: proximoId++,
          matriculaIdMatricula: idMatricula,
          avaliacaoIdAvaliacao: avaliacaoId,
          valorNota: valor,
          criadoEm: agora,
          atualizadoEm: agora,
        });
      }

      return resultado;
    });

    setToast({ mensagem: "Boletim salvo com sucesso!", tipo: "sucesso" });
  }

  const matricula = matriculas.find((item) => item.idMatricula === matriculaAberta) ?? null;
  const aluno = matricula ? alunos.find((item) => item.idAluno === matricula.alunoIdAluno) : undefined;
  const turma = turmas.find((item) => item.idTurma === turmaId);
  const periodo = periodos.find((item) => item.idPeriodo === periodoId);

  return (
    <>
      {matricula && aluno && turma && periodo ? (
        <BoletimAluno
          // Remonta ao trocar de aluno/período para reiniciar o rascunho de notas.
          key={`${matricula.idMatricula}-${periodo.idPeriodo}`}
          aluno={aluno}
          matricula={matricula}
          turma={turma}
          periodo={periodo}
          grades={grades}
          materias={materias}
          avaliacoes={avaliacoes}
          notas={notas}
          frequencias={frequencias}
          aoVoltar={() => setMatriculaAberta(null)}
          aoSalvar={(alteracoes) => salvarNotas(matricula.idMatricula, alteracoes)}
          aoNotificar={(mensagem, tipo) => setToast({ mensagem, tipo })}
        />
      ) : (
        <VisaoTurmaBoletim
          turmas={turmas}
          periodos={periodos}
          matriculas={matriculas}
          alunos={alunos}
          grades={grades}
          frequencias={frequencias}
          turmaId={turmaId}
          periodoId={periodoId}
          aoMudarTurma={mudarTurma}
          aoMudarPeriodo={setPeriodoId}
          aoAbrirBoletim={setMatriculaAberta}
        />
      )}

      {toast && <Toast mensagem={toast.mensagem} tipo={toast.tipo} aoFechar={() => setToast(null)} />}
    </>
  );
}

export default PaginaBoletins;
