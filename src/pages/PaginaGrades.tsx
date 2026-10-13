import { useCallback, useEffect, useState } from "react";
import ListaGrades from "../components/grades/ListaGrades";
import FormularioGrade from "../components/grades/FormularioGrade";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import { listarTurmas } from "../services/turmaService";
import { listarMaterias } from "../services/materiaService";
import { listarProfessores } from "../services/professorService";
import {
  atualizarGrade,
  criarGrade,
  ehErroDeVinculo,
  excluirGrade,
  listarGrades,
  mensagemDeErroGrade,
} from "../services/gradeService";
import type { GradeCurricular, GradeCurricularEntrada, Materia, Professor, Turma } from "../types";

function PaginaGrades() {
  const [grades, setGrades] = useState<GradeCurricular[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [gradeEmEdicao, setGradeEmEdicao] = useState<GradeCurricular | null>(null);

  const [gradeParaExcluir, setGradeParaExcluir] = useState<GradeCurricular | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [listaGrades, listaTurmas, listaMaterias, listaProfessores] = await Promise.all([
        listarGrades(),
        listarTurmas(),
        listarMaterias(),
        listarProfessores(),
      ]);
      setGrades(listaGrades);
      setTurmas(listaTurmas);
      setMaterias(listaMaterias);
      setProfessores(listaProfessores);
    } catch (e) {
      setErro(mensagemDeErroGrade(e, "Não foi possível carregar as grades curriculares."));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  function abrirNovaGrade() {
    setGradeEmEdicao(null);
    setModalAberto(true);
  }

  function abrirEdicaoGrade(idGrade: number) {
    const grade = grades.find((item) => item.idGrade === idGrade) ?? null;
    if (!grade) return;
    setGradeEmEdicao(grade);
    setModalAberto(true);
  }

  const cancelarFormulario = useCallback(() => {
    setGradeEmEdicao(null);
    setModalAberto(false);
  }, []);

  function existeGradeDuplicada(turmaId: number, materiaId: number): boolean {
    return grades.some(
      (item) =>
        item.idGrade !== gradeEmEdicao?.idGrade &&
        item.turmaId === turmaId &&
        item.materiaId === materiaId
    );
  }

  async function salvarFormulario(dados: GradeCurricularEntrada): Promise<void> {
    try {
      if (gradeEmEdicao) {
        await atualizarGrade(gradeEmEdicao.idGrade, dados);
        setMensagemSucesso("Grade curricular atualizada com sucesso!");
      } else {
        await criarGrade(dados);
        setMensagemSucesso("Grade curricular cadastrada com sucesso!");
      }
    } catch (e) {
      throw new Error(mensagemDeErroGrade(e, "Não foi possível salvar a grade curricular."));
    }
    cancelarFormulario();
    await carregar();
  }

  function pedirConfirmacaoExclusao(idGrade: number) {
    setGradeParaExcluir(grades.find((item) => item.idGrade === idGrade) ?? null);
  }

  const cancelarExclusao = useCallback(() => {
    if (!excluindo) setGradeParaExcluir(null);
  }, [excluindo]);

  async function confirmarExclusao() {
    if (!gradeParaExcluir || excluindo) return;
    const alvo = gradeParaExcluir;

    setExcluindo(true);
    setErro(null);
    try {
      await excluirGrade(alvo.idGrade);
      setGrades((atual) => atual.filter((g) => g.idGrade !== alvo.idGrade));
      setMensagemSucesso("Grade curricular excluída com sucesso!");
    } catch (e) {
      setErro(
        ehErroDeVinculo(e)
          ? "Não é possível excluir esta grade curricular: existem aulas, presenças ou avaliações vinculadas."
          : mensagemDeErroGrade(e, "Não foi possível excluir a grade curricular.")
      );
    } finally {
      setExcluindo(false);
      setGradeParaExcluir(null);
    }
  }

  const fecharToast = useCallback(() => setMensagemSucesso(null), []);

  const materiaAlvo = materias.find((m) => m.idMateria === gradeParaExcluir?.materiaId);
  const turmaAlvo = turmas.find((t) => t.idTurma === gradeParaExcluir?.turmaId);
  const descricaoExclusao =
    materiaAlvo && turmaAlvo
      ? `a grade de "${materiaAlvo.nomeMateria}" da turma "${turmaAlvo.nomeTurma}"`
      : "esta grade curricular";

  return (
    <>
      {!modalAberto ? (
        <ListaGrades
          grades={grades}
          turmas={turmas}
          materias={materias}
          professores={professores}
          carregando={carregando}
          erro={erro}
          aoDispensarErro={() => setErro(null)}
          aoRecarregar={() => void carregar()}
          aoNovaGrade={abrirNovaGrade}
          aoEditarGrade={abrirEdicaoGrade}
          aoExcluirGrade={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioGrade
          key={gradeEmEdicao?.idGrade ?? "nova"}
          gradeEditando={gradeEmEdicao}
          turmas={turmas}
          materias={materias}
          professores={professores}
          existeGradeDuplicada={existeGradeDuplicada}
          salvar={salvarFormulario}
          cancelar={cancelarFormulario}
        />
      )}

      {gradeParaExcluir && (
        <ModalConfirmacao
          titulo="Excluir grade curricular"
          mensagem={
            excluindo
              ? "Excluindo..."
              : `Tem certeza de que deseja excluir ${descricaoExclusao}? Esta ação não pode ser desfeita.`
          }
          textoCancelar="Cancelar"
          textoConfirmar={excluindo ? "Excluindo..." : "Excluir"}
          aoConfirmar={() => void confirmarExclusao()}
          aoCancelar={cancelarExclusao}
        />
      )}

      {mensagemSucesso && (
        <Toast mensagem={mensagemSucesso} tipo="sucesso" aoFechar={fecharToast} />
      )}
    </>
  );
}

export default PaginaGrades;