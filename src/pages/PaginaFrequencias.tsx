import { useEffect, useMemo, useState } from "react";
import ListaChamada, { type LinhaChamada } from "../components/frequencias/ListaChamada";
import Toast from "../components/ui/Toast";
import {
  matriculasMock,
  alunosMock,
  gradesCurricularesMock,
  materiasMock,
  turmasMock,
  frequenciasMock,
} from "../mock";
import { useColecaoPersistida } from "../hooks/useColecaoPersistida";
import { CHAVES_LOCALSTORAGE } from "../storage";
import type {
  Frequencia,
  Matricula,
  Aluno,
  GradeCurricular,
  Materia,
  Turma,
  StatusFrequencia,
} from "../types";

interface EstadoLinha {
  status: StatusFrequencia;
  justificativa: string;
}

function hoje(): string {
  return new Date().toISOString().slice(0, 10);
}

function agora(): string {
  return new Date().toISOString();
}

function PaginaFrequencias() {
  const [frequencias, setFrequencias] = useColecaoPersistida<Frequencia>(
    CHAVES_LOCALSTORAGE.frequencias,
    frequenciasMock
  );
  const [matriculas] = useColecaoPersistida<Matricula>(CHAVES_LOCALSTORAGE.matriculas, matriculasMock);
  const [alunos] = useColecaoPersistida<Aluno>(CHAVES_LOCALSTORAGE.alunos, alunosMock);
  const [grades] = useColecaoPersistida<GradeCurricular>(
    CHAVES_LOCALSTORAGE.gradesCurriculares,
    gradesCurricularesMock
  );
  const [materias] = useColecaoPersistida<Materia>(CHAVES_LOCALSTORAGE.materias, materiasMock);
  const [turmas] = useColecaoPersistida<Turma>(CHAVES_LOCALSTORAGE.turmas, turmasMock);

  const [turmaSelecionada, setTurmaSelecionada] = useState<number | "">("");
  const [gradeSelecionada, setGradeSelecionada] = useState<number | "">("");
  const [data, setData] = useState(hoje());
  const [estadoChamada, setEstadoChamada] = useState<Record<number, EstadoLinha>>({});
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  const gradesDaTurma = useMemo(
    () => (turmaSelecionada === "" ? [] : grades.filter((grade) => grade.turmaIdTurma === turmaSelecionada)),
    [grades, turmaSelecionada]
  );

  const matriculasDaTurma = useMemo(
    () =>
      turmaSelecionada === ""
        ? []
        : matriculas.filter(
            (matricula) => matricula.turmaIdTurma === turmaSelecionada && matricula.situacao === "Ativa"
          ),
    [matriculas, turmaSelecionada]
  );

  // `chamadaJaExiste` reflete, para o trio (turma, disciplina, data) atual, se
  // já existe ao menos um registro gravado — é o que decide badge, texto do
  // botão e mensagem do Toast. Recalculado a cada render junto com o efeito
  // abaixo, então fica sempre em sincronia com o que foi de fato carregado.
  const chamadaJaExiste = useMemo(() => {
    if (turmaSelecionada === "" || gradeSelecionada === "" || !data) return false;
    return frequencias.some(
      (frequencia) => frequencia.gradeIdGrade === gradeSelecionada && frequencia.dataAula === data
    );
  }, [frequencias, turmaSelecionada, gradeSelecionada, data]);

  // Reabre a "folha de chamada" (turma + disciplina + data) sempre que
  // qualquer um dos três filtros muda: pré-carrega o status de quem já tem
  // frequência lançada para essa combinação exata, e assume "Presente" para
  // quem ainda não tem. Não inclui `matriculas`/`frequencias` nas deps de
  // propósito — só a troca de filtro deve reabrir a folha, não uma escrita
  // no meio da edição (ex.: o próprio "Salvar Chamada" atualizando `frequencias`).
  useEffect(() => {
    if (turmaSelecionada === "" || gradeSelecionada === "" || !data) {
      setEstadoChamada({});
      return;
    }

    const matriculasAtuais = matriculas.filter(
      (matricula) => matricula.turmaIdTurma === turmaSelecionada && matricula.situacao === "Ativa"
    );

    const novoEstado: Record<number, EstadoLinha> = {};
    for (const matricula of matriculasAtuais) {
      const registroExistente = frequencias.find(
        (frequencia) =>
          frequencia.matriculaIdMatricula === matricula.idMatricula &&
          frequencia.gradeIdGrade === gradeSelecionada &&
          frequencia.dataAula === data
      );
      novoEstado[matricula.idMatricula] = registroExistente
        ? { status: registroExistente.status, justificativa: registroExistente.justificativa ?? "" }
        : { status: "Presente", justificativa: "" };
    }
    setEstadoChamada(novoEstado);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turmaSelecionada, gradeSelecionada, data]);

  const linhas: LinhaChamada[] = useMemo(
    () =>
      matriculasDaTurma.flatMap((matricula) => {
        const aluno = alunos.find((item) => item.idAluno === matricula.alunoIdAluno);
        if (!aluno) return [];
        const estado = estadoChamada[matricula.idMatricula] ?? {
          status: "Presente" as StatusFrequencia,
          justificativa: "",
        };
        return [{ matricula, aluno, status: estado.status, justificativa: estado.justificativa }];
      }),
    [matriculasDaTurma, alunos, estadoChamada]
  );

  function handleMudarTurma(novaTurma: number | "") {
    setTurmaSelecionada(novaTurma);
    setGradeSelecionada("");
  }

  // Usa Date.UTC (meio-dia, ainda que a hora não importe aqui) para que a
  // soma de dias não seja afetada pelo fuso horário local nem por DST.
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

  function handleMudarStatus(matriculaIdMatricula: number, status: StatusFrequencia) {
    setEstadoChamada((atual) => ({
      ...atual,
      [matriculaIdMatricula]: {
        status,
        justificativa: status === "Justificado" ? atual[matriculaIdMatricula]?.justificativa ?? "" : "",
      },
    }));
  }

  function handleMudarJustificativa(matriculaIdMatricula: number, justificativa: string) {
    setEstadoChamada((atual) => ({
      ...atual,
      [matriculaIdMatricula]: {
        status: atual[matriculaIdMatricula]?.status ?? "Justificado",
        justificativa,
      },
    }));
  }

  function handleMarcarTodosPresentes() {
    setEstadoChamada((atual) => {
      const novo = { ...atual };
      for (const matricula of matriculasDaTurma) {
        novo[matricula.idMatricula] = { status: "Presente", justificativa: "" };
      }
      return novo;
    });
  }

  function handleSalvarChamada() {
    if (turmaSelecionada === "" || gradeSelecionada === "" || !data) return;

    const eraAtualizacao = chamadaJaExiste;

    setFrequencias((atual) => {
      let proximoIdDisponivel = atual.reduce((maior, item) => Math.max(maior, item.idFrequencia), 0) + 1;
      const atualizado = [...atual];

      for (const matricula of matriculasDaTurma) {
        const linha = estadoChamada[matricula.idMatricula] ?? {
          status: "Presente" as StatusFrequencia,
          justificativa: "",
        };
        const justificativaFinal = linha.status === "Justificado" ? linha.justificativa : undefined;

        const indiceExistente = atualizado.findIndex(
          (item) =>
            item.matriculaIdMatricula === matricula.idMatricula &&
            item.gradeIdGrade === gradeSelecionada &&
            item.dataAula === data
        );

        if (indiceExistente >= 0) {
          atualizado[indiceExistente] = {
            ...atualizado[indiceExistente],
            status: linha.status,
            justificativa: justificativaFinal,
            atualizadoEm: agora(),
          };
        } else {
          atualizado.push({
            idFrequencia: proximoIdDisponivel++,
            matriculaIdMatricula: matricula.idMatricula,
            gradeIdGrade: Number(gradeSelecionada),
            dataAula: data,
            status: linha.status,
            justificativa: justificativaFinal,
            criadoEm: agora(),
            atualizadoEm: agora(),
          });
        }
      }

      return atualizado;
    });

    setMensagemSucesso(
      eraAtualizacao ? "Frequência atualizada com sucesso!" : "Chamada registrada com sucesso!"
    );
  }

  return (
    <>
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
        aoMudarStatus={handleMudarStatus}
        aoMudarJustificativa={handleMudarJustificativa}
        aoMarcarTodosPresentes={handleMarcarTodosPresentes}
        aoSalvar={handleSalvarChamada}
      />

      {mensagemSucesso && (
        <Toast
          mensagem={mensagemSucesso}
          tipo="sucesso"
          aoFechar={() => setMensagemSucesso(null)}
        />
      )}
    </>
  );
}

export default PaginaFrequencias;
