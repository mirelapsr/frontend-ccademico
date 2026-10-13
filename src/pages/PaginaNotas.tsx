import { useCallback, useEffect, useMemo, useState } from "react";
import GradeAvaliacoes, { type ItemAvaliacaoResumo } from "../components/notas/GradeAvaliacoes";
import DiarioNotas, { type LinhaLancamento } from "../components/notas/DiarioNotas";
import ModalAplicarNotaGeral from "../components/notas/ModalAplicarNotaGeral";
import Toast, { type TipoToast } from "../components/ui/Toast";
import { useLista } from "../hooks/useLista";
import {
  atualizarNota,
  criarNota,
  mensagemDeErroNota,
} from "../services/notaService";
import type {
  Nota,
  Matricula,
  Aluno,
  Avaliacao,
  GradeCurricular,
  Materia,
  Turma,
  Periodo,
} from "../types";

interface EstadoLinha {
  valorNota: string;
  observacao: string;
}

interface Feedback {
  tipo: TipoToast;
  mensagem: string;
}

function notaEhInvalida(valorNota: string): boolean {
  if (valorNota.trim() === "") return false;
  const numero = Number(valorNota.replace(",", "."));
  return Number.isNaN(numero) || numero < 0 || numero > 10;
}

function PaginaNotas() {
  const {
    dados: notas,
    erro: erroNotas,
    recarregar: recarregarNotas,
  } = useLista<Nota>("/notas");
  const { dados: matriculas } = useLista<Matricula>("/matriculas");
  const { dados: alunos } = useLista<Aluno>("/alunos");
  const { dados: avaliacoes } = useLista<Avaliacao>("/avaliacoes");
  const { dados: grades } = useLista<GradeCurricular>("/grades");
  const { dados: materias } = useLista<Materia>("/materias");
  const { dados: turmas } = useLista<Turma>("/turmas");
  const { dados: periodos } = useLista<Periodo>("/periodos");

  const [turmaSelecionada, setTurmaSelecionada] = useState<number | "">("");
  const [gradeSelecionada, setGradeSelecionada] = useState<number | "">("");
  const [periodoSelecionado, setPeriodoSelecionado] = useState<number | "">("");

  const [avaliacaoAtivaId, setAvaliacaoAtivaId] = useState<number | null>(null);
  const [estadoLancamento, setEstadoLancamento] = useState<Record<number, EstadoLinha>>({});
  const [modalNotaGeralAberto, setModalNotaGeralAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  
  const gradesDaTurma = useMemo(
    () => (turmaSelecionada === "" ? [] : grades.filter((grade) => grade.turmaId === turmaSelecionada)),
    [grades, turmaSelecionada]
  );

  const matriculasAtivasDaTurma = useMemo(
    () =>
      turmaSelecionada === ""
        ? []
        : matriculas.filter(
            (matricula) => matricula.turmaId === turmaSelecionada && matricula.situacao === "Ativa"
          ),
    [matriculas, turmaSelecionada]
  );

  const itensGrade: ItemAvaliacaoResumo[] = useMemo(() => {
    if (turmaSelecionada === "") return [];
    const idsGradesDaTurma = new Set(gradesDaTurma.map((grade) => grade.idGrade));
    const idsAlunosAtivos = new Set(matriculasAtivasDaTurma.map((m) => m.alunoId));

    return avaliacoes
      .filter(
        (avaliacao) =>
          idsGradesDaTurma.has(avaliacao.gradeId) &&
          (gradeSelecionada === "" || avaliacao.gradeId === gradeSelecionada) &&
          (periodoSelecionado === "" || avaliacao.periodoId === periodoSelecionado)
      )
      .map((avaliacao) => {
        const grade = gradesDaTurma.find((item) => item.idGrade === avaliacao.gradeId);
        const nomeMateria =
          materias.find((materia) => materia.idMateria === grade?.materiaId)?.nomeMateria ??
          "Matéria";

        const notasDaAvaliacao = notas.filter(
          (nota) =>
            nota.avaliacaoId === avaliacao.idAvaliacao &&
            idsAlunosAtivos.has(nota.alunoId)
        );

        const media =
          notasDaAvaliacao.length === 0
            ? null
            : notasDaAvaliacao.reduce((soma, nota) => soma + Number(nota.valorNota), 0) /
              notasDaAvaliacao.length;

        return {
          avaliacao,
          nomeMateria,
          media,
          notasLancadas: notasDaAvaliacao.length,
          totalAlunos: matriculasAtivasDaTurma.length,
        };
      });
  }, [
    avaliacoes,
    gradesDaTurma,
    materias,
    notas,
    turmaSelecionada,
    gradeSelecionada,
    periodoSelecionado,
    matriculasAtivasDaTurma,
  ]);

  const avaliacaoAtiva = useMemo(
    () => avaliacoes.find((avaliacao) => avaliacao.idAvaliacao === avaliacaoAtivaId) ?? null,
    [avaliacoes, avaliacaoAtivaId]
  );

  const gradeDaAvaliacaoAtiva = useMemo(
    () => (avaliacaoAtiva ? grades.find((grade) => grade.idGrade === avaliacaoAtiva.gradeId) : null),
    [grades, avaliacaoAtiva]
  );

  const turmaDaAvaliacaoAtiva = useMemo(
    () =>
      gradeDaAvaliacaoAtiva
        ? turmas.find((turma) => turma.idTurma === gradeDaAvaliacaoAtiva.turmaId)
        : null,
    [turmas, gradeDaAvaliacaoAtiva]
  );

  const nomeMateriaAtiva = useMemo(
    () =>
      gradeDaAvaliacaoAtiva
        ? materias.find((materia) => materia.idMateria === gradeDaAvaliacaoAtiva.materiaId)?.nomeMateria ??
          "Matéria"
        : "",
    [materias, gradeDaAvaliacaoAtiva]
  );

  const matriculasDaAvaliacaoAtiva = useMemo(
    () =>
      gradeDaAvaliacaoAtiva
        ? matriculas.filter(
            (matricula) =>
              matricula.turmaId === gradeDaAvaliacaoAtiva.turmaId && matricula.situacao === "Ativa"
          )
        : [],
    [matriculas, gradeDaAvaliacaoAtiva]
  );

  useEffect(() => {
    if (avaliacaoAtivaId === null) {
      setEstadoLancamento({});
      return;
    }

    const avaliacao = avaliacoes.find((a) => a.idAvaliacao === avaliacaoAtivaId);
    const grade = grades.find((item) => item.idGrade === avaliacao?.gradeId);
    if (!grade) {
      setEstadoLancamento({});
      return;
    }

    const matriculasAtuais = matriculas.filter(
      (matricula) => matricula.turmaId === grade.turmaId && matricula.situacao === "Ativa"
    );

    const novoEstado: Record<number, EstadoLinha> = {};
    for (const matricula of matriculasAtuais) {
      const notaExistente = notas.find(
        (nota) =>
          nota.alunoId === matricula.alunoId && nota.avaliacaoId === avaliacaoAtivaId
      );
      novoEstado[matricula.idMatricula] = notaExistente
        ? {
            valorNota: String(notaExistente.valorNota),
            observacao: notaExistente.observacao ?? "",
          }
        : { valorNota: "", observacao: "" };
    }
    setEstadoLancamento(novoEstado);
  }, [avaliacaoAtivaId, avaliacoes, grades, matriculas, notas]);

  const linhasDiario: LinhaLancamento[] = useMemo(
    () =>
      matriculasDaAvaliacaoAtiva.flatMap((matricula) => {
        const aluno = alunos.find((item) => item.idAluno === matricula.alunoId);
        if (!aluno) return [];
        const estado = estadoLancamento[matricula.idMatricula] ?? { valorNota: "", observacao: "" };
        return [
          {
            matricula,
            aluno,
            valorNota: estado.valorNota,
            observacao: estado.observacao,
            invalida: notaEhInvalida(estado.valorNota),
          },
        ];
      }),
    [matriculasDaAvaliacaoAtiva, alunos, estadoLancamento]
  );

  function handleAbrirDiario(idAvaliacao: number) {
    setAvaliacaoAtivaId(idAvaliacao);
  }

  function handleVoltarParaGrid() {
    setAvaliacaoAtivaId(null);
  }

  function handleMudarValorNota(idMatricula: number, valor: string) {
    setEstadoLancamento((atual) => ({
      ...atual,
      [idMatricula]: { valorNota: valor, observacao: atual[idMatricula]?.observacao ?? "" },
    }));
  }

  function handleMudarObservacao(idMatricula: number, valor: string) {
    setEstadoLancamento((atual) => ({
      ...atual,
      [idMatricula]: { valorNota: atual[idMatricula]?.valorNota ?? "", observacao: valor },
    }));
  }

  function handleAplicarNotaGeral(valor: number) {
    const valorParaInput = String(valor);
    const valorParaExibicao = valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    setEstadoLancamento((atual) => {
      const novo = { ...atual };
      for (const matricula of matriculasDaAvaliacaoAtiva) {
        novo[matricula.idMatricula] = {
          valorNota: valorParaInput,
          observacao: novo[matricula.idMatricula]?.observacao ?? "",
        };
      }
      return novo;
    });
    setModalNotaGeralAberto(false);
    setFeedback({
      mensagem: `Nota ${valorParaExibicao} aplicada a todos os alunos da avaliação.`,
      tipo: "sucesso",
    });
  }

  async function handleSalvarNotas() {
    if (avaliacaoAtivaId === null || salvando) return;

    const existeLinhaInvalida = linhasDiario.some((linha) => linha.invalida);
    if (existeLinhaInvalida) {
      setFeedback({
        mensagem: "Corrija as notas fora do intervalo permitido (0,0 a 10,0) antes de salvar.",
        tipo: "erro",
      });
      return;
    }

    setSalvando(true);
    try {
      const operacoes = matriculasDaAvaliacaoAtiva.map(async (matricula) => {
        const estado = estadoLancamento[matricula.idMatricula];
        if (!estado || estado.valorNota.trim() === "") return;

        const valorNumerico = Number(estado.valorNota.replace(",", "."));
        const obsFinal = estado.observacao.trim() || undefined;

        const notaExistente = notas.find(
          (nota) =>
            nota.alunoId === matricula.alunoId && nota.avaliacaoId === avaliacaoAtivaId
        );

        if (notaExistente) {
          return atualizarNota(notaExistente.idNota, {
            valorNota: String(valorNumerico),
            observacao: obsFinal,
          });
        }

        return criarNota({
          alunoId: matricula.alunoId,
          avaliacaoId: avaliacaoAtivaId,
          valorNota: String(valorNumerico),
          observacao: obsFinal,
        });
      });

      await Promise.all(operacoes);
      await recarregarNotas();
      setFeedback({ mensagem: "Notas salvas com sucesso!", tipo: "sucesso" });
    } catch (e: unknown) {
      setFeedback({
        mensagem: mensagemDeErroNota(e, "Não foi possível salvar as notas."),
        tipo: "erro",
      });
    } finally {
      setSalvando(false);
    }
  }

  const fecharFeedback = useCallback(() => setFeedback(null), []);

  return (
    <>
      {erroNotas && (
        <div
          style={{
            margin: "0 0 16px",
            padding: "10px 12px",
            background: "#fbeae9",
            color: "#a4302b",
            borderRadius: "4px",
          }}
        >
          {erroNotas}
        </div>
      )}

      {avaliacaoAtivaId === null || !avaliacaoAtiva || !turmaDaAvaliacaoAtiva ? (
        <GradeAvaliacoes
          turmas={turmas}
          gradesDaTurma={gradesDaTurma}
          materias={materias}
          periodos={periodos}
          turmaSelecionada={turmaSelecionada}
          gradeSelecionada={gradeSelecionada}
          periodoSelecionado={periodoSelecionado}
          aoMudarTurma={(valor) => {
            setTurmaSelecionada(valor);
            setGradeSelecionada("");
          }}
          aoMudarGrade={setGradeSelecionada}
          aoMudarPeriodo={setPeriodoSelecionado}
          itens={itensGrade}
          aoLancarNotas={handleAbrirDiario}
        />
      ) : (
        <DiarioNotas
          avaliacao={avaliacaoAtiva}
          nomeMateria={nomeMateriaAtiva}
          nomeTurma={turmaDaAvaliacaoAtiva.nomeTurma}
          linhas={linhasDiario}
          aoVoltar={handleVoltarParaGrid}
          aoMudarValorNota={handleMudarValorNota}
          aoMudarObservacao={handleMudarObservacao}
          aoAbrirModalNotaGeral={() => setModalNotaGeralAberto(true)}
          aoSalvar={() => void handleSalvarNotas()}
        />
      )}

      {modalNotaGeralAberto && (
        <ModalAplicarNotaGeral
          aoConfirmar={handleAplicarNotaGeral}
          aoCancelar={() => setModalNotaGeralAberto(false)}
        />
      )}

      {feedback && (
        <Toast
          mensagem={feedback.mensagem}
          tipo={feedback.tipo}
          duracaoMs={feedback.tipo === "erro" ? 6000 : undefined}
          aoFechar={fecharFeedback}
        />
      )}
    </>
  );
}

export default PaginaNotas;