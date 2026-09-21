import { useEffect, useMemo, useState } from "react";
import GradeAvaliacoes, { type ItemAvaliacaoResumo } from "../components/notas/GradeAvaliacoes";
import DiarioNotas, { type LinhaLancamento } from "../components/notas/DiarioNotas";
import ModalAplicarNotaGeral from "../components/notas/ModalAplicarNotaGeral";
import Toast, { type TipoToast } from "../components/ui/Toast";
import {
  matriculasMock,
  alunosMock,
  avaliacoesMock,
  gradesCurricularesMock,
  materiasMock,
  turmasMock,
  periodosMock,
  notasMock,
} from "../mock";
import { useColecaoPersistida } from "../hooks/useColecaoPersistida";
import { CHAVES_LOCALSTORAGE } from "../storage";
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

function agora(): string {
  return new Date().toISOString();
}

function notaEhInvalida(valorNota: string): boolean {
  if (valorNota.trim() === "") return false;
  const numero = Number(valorNota.replace(",", "."));
  return Number.isNaN(numero) || numero < 0 || numero > 10;
}

function PaginaNotas() {
  const [notas, setNotas] = useColecaoPersistida<Nota>(CHAVES_LOCALSTORAGE.notas, notasMock);
  const [matriculas] = useColecaoPersistida<Matricula>(CHAVES_LOCALSTORAGE.matriculas, matriculasMock);
  const [alunos] = useColecaoPersistida<Aluno>(CHAVES_LOCALSTORAGE.alunos, alunosMock);
  const [avaliacoes] = useColecaoPersistida<Avaliacao>(CHAVES_LOCALSTORAGE.avaliacoes, avaliacoesMock);
  const [grades] = useColecaoPersistida<GradeCurricular>(
    CHAVES_LOCALSTORAGE.gradesCurriculares,
    gradesCurricularesMock
  );
  const [materias] = useColecaoPersistida<Materia>(CHAVES_LOCALSTORAGE.materias, materiasMock);
  const [turmas] = useColecaoPersistida<Turma>(CHAVES_LOCALSTORAGE.turmas, turmasMock);
  const [periodos] = useColecaoPersistida<Periodo>(CHAVES_LOCALSTORAGE.periodos, periodosMock);

  const [turmaSelecionada, setTurmaSelecionada] = useState<number | "">("");
  const [gradeSelecionada, setGradeSelecionada] = useState<number | "">("");
  const [periodoSelecionado, setPeriodoSelecionado] = useState<number | "">("");

  const [avaliacaoAtivaId, setAvaliacaoAtivaId] = useState<number | null>(null);
  const [estadoLancamento, setEstadoLancamento] = useState<Record<number, EstadoLinha>>({});
  const [modalNotaGeralAberto, setModalNotaGeralAberto] = useState(false);

  const [mensagem, setMensagem] = useState<{ texto: string; tipo: TipoToast } | null>(null);

  const gradesDaTurma = useMemo(
    () => (turmaSelecionada === "" ? [] : grades.filter((grade) => grade.turmaIdTurma === turmaSelecionada)),
    [grades, turmaSelecionada]
  );

  const matriculasAtivasDaTurma = useMemo(
    () =>
      turmaSelecionada === ""
        ? []
        : matriculas.filter(
            (matricula) => matricula.turmaIdTurma === turmaSelecionada && matricula.situacao === "Ativa"
          ),
    [matriculas, turmaSelecionada]
  );

  const itensGrade: ItemAvaliacaoResumo[] = useMemo(() => {
    if (turmaSelecionada === "") return [];
    const idsGradesDaTurma = new Set(gradesDaTurma.map((grade) => grade.idGrade));

    return avaliacoes
      .filter(
        (avaliacao) =>
          idsGradesDaTurma.has(avaliacao.gradeIdGrade) &&
          (gradeSelecionada === "" || avaliacao.gradeIdGrade === gradeSelecionada) &&
          (periodoSelecionado === "" || avaliacao.periodoIdPeriodo === periodoSelecionado)
      )
      .map((avaliacao) => {
        const grade = gradesDaTurma.find((item) => item.idGrade === avaliacao.gradeIdGrade);
        const nomeMateria =
          materias.find((materia) => materia.idMateria === grade?.materiaIdMateria)?.nomeMateria ??
          "Matéria";

        const notasDaAvaliacao = notas.filter(
          (nota) =>
            nota.avaliacaoIdAvaliacao === avaliacao.idAvaliacao &&
            matriculasAtivasDaTurma.some((matricula) => matricula.idMatricula === nota.matriculaIdMatricula)
        );

        const media =
          notasDaAvaliacao.length === 0
            ? null
            : notasDaAvaliacao.reduce((soma, nota) => soma + nota.valorNota, 0) / notasDaAvaliacao.length;

        return {
          avaliacao,
          nomeMateria,
          media,
          notasLancadas: notasDaAvaliacao.length,
          totalAlunos: matriculasAtivasDaTurma.length,
        };
      });
  }, [avaliacoes, gradesDaTurma, materias, notas, turmaSelecionada, gradeSelecionada, periodoSelecionado, matriculasAtivasDaTurma]);

  const avaliacaoAtiva = useMemo(
    () => avaliacoes.find((avaliacao) => avaliacao.idAvaliacao === avaliacaoAtivaId) ?? null,
    [avaliacoes, avaliacaoAtivaId]
  );

  const gradeDaAvaliacaoAtiva = useMemo(
    () => (avaliacaoAtiva ? grades.find((grade) => grade.idGrade === avaliacaoAtiva.gradeIdGrade) : null),
    [grades, avaliacaoAtiva]
  );

  const turmaDaAvaliacaoAtiva = useMemo(
    () =>
      gradeDaAvaliacaoAtiva ? turmas.find((turma) => turma.idTurma === gradeDaAvaliacaoAtiva.turmaIdTurma) : null,
    [turmas, gradeDaAvaliacaoAtiva]
  );

  const nomeMateriaAtiva = useMemo(
    () =>
      gradeDaAvaliacaoAtiva
        ? materias.find((materia) => materia.idMateria === gradeDaAvaliacaoAtiva.materiaIdMateria)?.nomeMateria ??
          "Matéria"
        : "",
    [materias, gradeDaAvaliacaoAtiva]
  );

  const matriculasDaAvaliacaoAtiva = useMemo(
    () =>
      gradeDaAvaliacaoAtiva
        ? matriculas.filter(
            (matricula) =>
              matricula.turmaIdTurma === gradeDaAvaliacaoAtiva.turmaIdTurma && matricula.situacao === "Ativa"
          )
        : [],
    [matriculas, gradeDaAvaliacaoAtiva]
  );

  useEffect(() => {
    if (avaliacaoAtivaId === null) {
      setEstadoLancamento({});
      return;
    }

    const grade = grades.find((item) => item.idGrade === avaliacoes.find((a) => a.idAvaliacao === avaliacaoAtivaId)?.gradeIdGrade);
    if (!grade) {
      setEstadoLancamento({});
      return;
    }

    const matriculasAtuais = matriculas.filter(
      (matricula) => matricula.turmaIdTurma === grade.turmaIdTurma && matricula.situacao === "Ativa"
    );

    const novoEstado: Record<number, EstadoLinha> = {};
    for (const matricula of matriculasAtuais) {
      const notaExistente = notas.find(
        (nota) =>
          nota.matriculaIdMatricula === matricula.idMatricula && nota.avaliacaoIdAvaliacao === avaliacaoAtivaId
      );
      novoEstado[matricula.idMatricula] = notaExistente
        ? {
            // String(number) sempre usa ponto — é o único formato que um
            // <input type="number"> aceita como value. toLocaleString("pt-BR")
            // gera vírgula, que o input rejeita silenciosamente (o valor
            // nunca aparece, dando a impressão de estado "travado").
            valorNota: String(notaExistente.valorNota),
            observacao: notaExistente.observacao ?? "",
          }
        : { valorNota: "", observacao: "" };
    }
    setEstadoLancamento(novoEstado);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avaliacaoAtivaId]);

  const linhasDiario: LinhaLancamento[] = useMemo(
    () =>
      matriculasDaAvaliacaoAtiva.flatMap((matricula) => {
        const aluno = alunos.find((item) => item.idAluno === matricula.alunoIdAluno);
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
    // Dois formatos separados de propósito: o input é type="number" e só
    // aceita ponto como separador decimal (String(valor) sempre gera isso);
    // vírgula (toLocaleString pt-BR) é só para o texto do Toast, nunca para
    // o value do input — era exatamente essa mistura que travava os campos.
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
    setMensagem({
      texto: `Nota ${valorParaExibicao} aplicada para todos os alunos da avaliação.`,
      tipo: "sucesso",
    });
  }

  function handleSalvarNotas() {
    if (avaliacaoAtivaId === null) return;

    const existeLinhaInvalida = linhasDiario.some((linha) => linha.invalida);
    if (existeLinhaInvalida) {
      setMensagem({
        texto: "Corrija as notas fora do intervalo permitido (0,0 a 10,0) antes de salvar.",
        tipo: "erro",
      });
      return;
    }

    setNotas((atual) => {
      let proximoIdDisponivel = atual.reduce((maior, item) => Math.max(maior, item.idNota), 0) + 1;
      const atualizado = [...atual];

      for (const matricula of matriculasDaAvaliacaoAtiva) {
        const estado = estadoLancamento[matricula.idMatricula];
        if (!estado || estado.valorNota.trim() === "") continue;

        const valorNota = Number(estado.valorNota.replace(",", "."));
        const observacao = estado.observacao.trim() || undefined;

        const indiceExistente = atualizado.findIndex(
          (item) =>
            item.matriculaIdMatricula === matricula.idMatricula &&
            item.avaliacaoIdAvaliacao === avaliacaoAtivaId
        );

        if (indiceExistente >= 0) {
          atualizado[indiceExistente] = {
            ...atualizado[indiceExistente],
            valorNota,
            observacao,
            atualizadoEm: agora(),
          };
        } else {
          atualizado.push({
            idNota: proximoIdDisponivel++,
            matriculaIdMatricula: matricula.idMatricula,
            avaliacaoIdAvaliacao: avaliacaoAtivaId,
            valorNota,
            observacao,
            criadoEm: agora(),
            atualizadoEm: agora(),
          });
        }
      }

      return atualizado;
    });

    setMensagem({ texto: "Notas salvas com sucesso!", tipo: "sucesso" });
  }

  return (
    <>
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
          aoSalvar={handleSalvarNotas}
        />
      )}

      {modalNotaGeralAberto && (
        <ModalAplicarNotaGeral
          aoConfirmar={handleAplicarNotaGeral}
          aoCancelar={() => setModalNotaGeralAberto(false)}
        />
      )}

      {mensagem && (
        <Toast
          mensagem={mensagem.texto}
          tipo={mensagem.tipo}
          aoFechar={() => setMensagem(null)}
        />
      )}
    </>
  );
}

export default PaginaNotas;