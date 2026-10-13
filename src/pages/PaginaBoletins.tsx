import { useCallback, useMemo, useState } from "react";
import VisaoTurmaBoletim from "../components/boletins/VisaoTurmaBoletim";
import BoletimAluno, { type AlteracaoNota } from "../components/boletins/BoletimAluno";
import Toast, { type TipoToast } from "../components/ui/Toast";
import { useLista } from "../hooks/useLista";
import {
  atualizarNota,
  criarNota,
  mensagemDeErroNota,
} from "../services/notaService";
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

function PaginaBoletins() {
  const { dados: notas, recarregar: recarregarNotas, carregando: carregandoNotas } = useLista<Nota>("/notas");
  const { dados: matriculas, carregando: carregandoMatriculas } = useLista<Matricula>("/matriculas");
  const { dados: alunos, carregando: carregandoAlunos } = useLista<Aluno>("/alunos");
  const { dados: turmas, carregando: carregandoTurmas } = useLista<Turma>("/turmas");
  const { dados: periodos, carregando: carregandoPeriodos } = useLista<Periodo>("/periodos");
  const { dados: materias, carregando: carregandoMaterias } = useLista<Materia>("/materias");
  const { dados: grades, carregando: carregandoGrades } = useLista<GradeCurricular>("/grades");
  const { dados: avaliacoes, carregando: carregandoAvaliacoes } = useLista<Avaliacao>("/avaliacoes");
  const { dados: frequencias, carregando: carregandoFrequencias } = useLista<Frequencia>("/frequencias");

  const [turmaId, setTurmaId] = useState<number | null>(null);
  const [periodoIdManual, setPeriodoIdManual] = useState<number | null>(null);
  const [matriculaAberta, setMatriculaAberta] = useState<number | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [toast, setToast] = useState<{ mensagem: string; tipo: TipoToast } | null>(null);

  const periodoAtivo = useMemo(
    () => periodos.find((p) => p.situacao === "Ativo") ?? periodos[0] ?? null,
    [periodos]
  );

  const periodoId = periodoIdManual ?? periodoAtivo?.idPeriodo ?? null;

  function mudarTurma(idTurma: number | null) {
    setTurmaId(idTurma);
    setMatriculaAberta(null);
  }

  async function salvarNotas(alunoIdAlvo: number, alteracoes: AlteracaoNota[]) {
    if (salvando) return;
    setSalvando(true);

    try {
      const operacoes = alteracoes.map(async ({ avaliacaoId, valor }) => {
        const notaExistente = notas.find(
          (n) => n.alunoId === alunoIdAlvo && n.avaliacaoId === avaliacaoId
        );

        if (valor === null) {
          return;
        }

        if (notaExistente) {
          return atualizarNota(notaExistente.idNota, {
            valorNota: String(valor),
          });
        }

        return criarNota({
          alunoId: alunoIdAlvo,
          avaliacaoId,
          valorNota: String(valor),
        });
      });

      await Promise.all(operacoes);
      await recarregarNotas();
      setToast({ mensagem: "Boletim salvo com sucesso!", tipo: "sucesso" });
    } catch (e: unknown) {
      setToast({
        mensagem: mensagemDeErroNota(e, "Erro ao salvar notas do boletim."),
        tipo: "erro",
      });
    } finally {
      setSalvando(false);
    }
  }

  const matricula = matriculas.find((item) => item.idMatricula === matriculaAberta) ?? null;
  const aluno = matricula ? alunos.find((item) => item.idAluno === matricula.alunoId) : undefined;
  const turma = turmas.find((item) => item.idTurma === turmaId);
  const periodo = periodos.find((item) => item.idPeriodo === periodoId);

  const carregandoGeral =
    carregandoNotas ||
    carregandoMatriculas ||
    carregandoAlunos ||
    carregandoTurmas ||
    carregandoPeriodos ||
    carregandoMaterias ||
    carregandoGrades ||
    carregandoAvaliacoes ||
    carregandoFrequencias;

  const fecharToast = useCallback(() => setToast(null), []);

  if (carregandoGeral && turmas.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
        <p>Carregando dados do boletim...</p>
      </div>
    );
  }

  return (
    <>
      {matricula && aluno && turma && periodo ? (
        <BoletimAluno
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
          aoSalvar={(alteracoes) => void salvarNotas(aluno.idAluno, alteracoes)}
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
          aoMudarPeriodo={setPeriodoIdManual}
          aoAbrirBoletim={setMatriculaAberta}
        />
      )}

      {toast && <Toast mensagem={toast.mensagem} tipo={toast.tipo} aoFechar={fecharToast} />}
    </>
  );
}

export default PaginaBoletins;