import { useCallback, useEffect, useMemo, useState } from "react";
import ListaChamada, { type LinhaChamada } from "../components/frequencias/ListaChamada";
import Toast, { type TipoToast } from "../components/ui/Toast";
import { useLista } from "../hooks/useLista";
import {
  atualizarFrequencia,
  criarFrequencia,
  mensagemDeErroFrequencia,
} from "../services/frequenciaService";
import type {
  Frequencia,
  Matricula,
  Aluno,
  GradeCurricular,
  Materia,
  Turma,
  SituacaoFrequencia,
} from "../types";

interface EstadoLinha {
  situacao: SituacaoFrequencia;
  justificativa: string;
}

interface Feedback {
  tipo: TipoToast;
  mensagem: string;
}

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

function PaginaFrequencias() {
  const {
    dados: frequencias,
    erro: erroFrequencias,
    recarregar: recarregarFrequencias,
  } = useLista<Frequencia>("/frequencias");
  const { dados: matriculas } = useLista<Matricula>("/matriculas");
  const { dados: alunos } = useLista<Aluno>("/alunos");
  const { dados: grades } = useLista<GradeCurricular>("/grades");
  const { dados: materias } = useLista<Materia>("/materias");
  const { dados: turmas } = useLista<Turma>("/turmas");

  const [turmaSelecionada, setTurmaSelecionada] = useState<number | "">("");
  const [gradeSelecionada, setGradeSelecionada] = useState<number | "">("");
  const [data, setData] = useState(hoje());
  const [estadoChamada, setEstadoChamada] = useState<Record<number, EstadoLinha>>({});
  const [salvando, setSalvando] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const gradesDaTurma = useMemo(
    () => (turmaSelecionada === "" ? [] : grades.filter((g) => g.turmaId === turmaSelecionada)),
    [grades, turmaSelecionada]
  );

  const alunosAtivosDaTurma = useMemo(() => {
    if (turmaSelecionada === "") return [];
    const idsAlunosComMatriculaAtiva = new Set(
      matriculas
        .filter((m) => m.turmaId === turmaSelecionada && m.situacao === "Ativa")
        .map((m) => m.alunoId)
    );
    return alunos.filter((aluno) => idsAlunosComMatriculaAtiva.has(aluno.idAluno));
  }, [matriculas, alunos, turmaSelecionada]);

  const chamadaJaExiste = useMemo(() => {
    if (turmaSelecionada === "" || gradeSelecionada === "" || !data) return false;
    return frequencias.some(
      (freq) => freq.gradeId === gradeSelecionada && freq.dataFrequencia === data
    );
  }, [frequencias, turmaSelecionada, gradeSelecionada, data]);

  useEffect(() => {
    if (turmaSelecionada === "" || gradeSelecionada === "" || !data) {
      setEstadoChamada({});
      return;
    }

    const novoEstado: Record<number, EstadoLinha> = {};
    for (const aluno of alunosAtivosDaTurma) {
      const registroExistente = frequencias.find(
        (freq) =>
          freq.alunoId === aluno.idAluno &&
          freq.gradeId === gradeSelecionada &&
          freq.dataFrequencia === data
      );
      novoEstado[aluno.idAluno] = registroExistente
        ? {
            situacao: registroExistente.situacao,
            justificativa: registroExistente.justificativa ?? "",
          }
        : { situacao: "Presente", justificativa: "" };
    }
    setEstadoChamada(novoEstado);
  }, [turmaSelecionada, gradeSelecionada, data, alunosAtivosDaTurma, frequencias]);

  const linhas: LinhaChamada[] = useMemo(
    () =>
      alunosAtivosDaTurma.map((aluno) => {
        const estado = estadoChamada[aluno.idAluno] ?? {
          situacao: "Presente" as SituacaoFrequencia,
          justificativa: "",
        };
        return {
          aluno,
          situacao: estado.situacao,
          justificativa: estado.justificativa,
        };
      }),
    [alunosAtivosDaTurma, estadoChamada]
  );

  function handleMudarTurma(novaTurma: number | "") {
    setTurmaSelecionada(novaTurma);
    setGradeSelecionada("");
  }

  function somarDias(dataIso: string, quantidade: number): string {
    const [ano, mes, dia] = dataIso.split("-").map(Number);
    const base = new Date(Date.UTC(ano, mes - 1, dia + quantidade));
    return base.toISOString().slice(0, 10);
  }

  function handleDiaAnterior() {
    setData((atual) => somarDias(atual, -1));
  }

  function handleProximoDia() {
    setData((atual) => somarDias(atual, 1));
  }

  function handleHoje() {
    setData(hoje());
  }

  function handleMudarSituacao(alunoId: number, situacao: SituacaoFrequencia) {
    setEstadoChamada((atual) => ({
      ...atual,
      [alunoId]: {
        situacao,
        justificativa: situacao === "FaltaJustificada" ? atual[alunoId]?.justificativa ?? "" : "",
      },
    }));
  }

  function handleMudarJustificativa(alunoId: number, justificativa: string) {
    setEstadoChamada((atual) => ({
      ...atual,
      [alunoId]: {
        situacao: atual[alunoId]?.situacao ?? "FaltaJustificada",
        justificativa,
      },
    }));
  }

  function handleMarcarTodosPresentes() {
    setEstadoChamada((atual) => {
      const novo = { ...atual };
      for (const aluno of alunosAtivosDaTurma) {
        novo[aluno.idAluno] = { situacao: "Presente", justificativa: "" };
      }
      return novo;
    });
  }

  async function handleSalvarChamada() {
    if (turmaSelecionada === "" || gradeSelecionada === "" || !data || salvando) return;

    setSalvando(true);
    try {
      const chamadasParaProcessar = alunosAtivosDaTurma.map(async (aluno) => {
        const linha = estadoChamada[aluno.idAluno] ?? {
          situacao: "Presente" as SituacaoFrequencia,
          justificativa: "",
        };

        const justificativaFinal =
          linha.situacao === "FaltaJustificada"
            ? linha.justificativa.trim() || null
            : null;

        const registroExistente = frequencias.find(
          (freq) =>
            freq.alunoId === aluno.idAluno &&
            freq.gradeId === gradeSelecionada &&
            freq.dataFrequencia === data
        );

        if (registroExistente) {
          return atualizarFrequencia(registroExistente.idFrequencia, {
            situacao: linha.situacao,
            justificativa: justificativaFinal,
            dataFrequencia: data,
          });
        }

        return criarFrequencia({
          alunoId: aluno.idAluno,
          gradeId: Number(gradeSelecionada),
          dataFrequencia: data,
          situacao: linha.situacao,
          justificativa: justificativaFinal,
        });
      });

      await Promise.all(chamadasParaProcessar);
      await recarregarFrequencias();

      setFeedback({
        tipo: "sucesso",
        mensagem: chamadaJaExiste
          ? "Frequência atualizada com sucesso!"
          : "Chamada registrada com sucesso!",
      });
    } catch (e: unknown) {
      setFeedback({
        tipo: "erro",
        mensagem: mensagemDeErroFrequencia(e, "Não foi possível salvar a frequência."),
      });
    } finally {
      setSalvando(false);
    }
  }

  const fecharFeedback = useCallback(() => setFeedback(null), []);

  return (
    <>
      {erroFrequencias && (
        <div style={{ margin: "0 0 16px", padding: "10px 12px", background: "#fbeae9", color: "#a4302b", borderRadius: "4px" }}>
          {erroFrequencias}
        </div>
      )}

      <ListaChamada
        turmas={turmas}
        gradesDaTurma={gradesDaTurma}
        materias={materias}
        turmaSelecionada={turmaSelecionada}
        gradeSelecionada={gradeSelecionada}
        data={data}
        chamadaJaExiste={chamadaJaExiste}
        aoMudarTurma={handleMudarTurma}
        aoMudarGrade={setGradeSelecionada}
        aoMudarData={setData}
        aoDiaAnterior={handleDiaAnterior}
        aoHoje={handleHoje}
        aoProximoDia={handleProximoDia}
        linhas={linhas}
        aoMudarSituacao={handleMudarSituacao}
        aoMudarJustificativa={handleMudarJustificativa}
        aoMarcarTodosPresentes={handleMarcarTodosPresentes}
        aoSalvar={() => void handleSalvarChamada()}
      />

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

export default PaginaFrequencias;