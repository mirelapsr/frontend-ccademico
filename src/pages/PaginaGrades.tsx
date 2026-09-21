import { useState } from "react";
import ListaGrades from "../components/grades/ListaGrades";
import FormularioGrade from "../components/grades/FormularioGrade";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import { turmasMock, materiasMock, professoresMock, gradesCurricularesMock } from "../mock";
import { useColecaoPersistida } from "../hooks/useColecaoPersistida";
import { CHAVES_LOCALSTORAGE } from "../storage";
import type { GradeCurricular, GradeCurricularEntrada, Turma, Materia, Professor } from "../types";

type Tela = "lista" | "formulario";

function proximoId(grades: GradeCurricular[]): number {
  return grades.reduce((maior, grade) => Math.max(maior, grade.idGrade), 0) + 1;
}

function agora(): string {
  return new Date().toISOString();
}

function PaginaGrades() {
  const [grades, setGrades] = useColecaoPersistida<GradeCurricular>(
    CHAVES_LOCALSTORAGE.gradesCurriculares,
    gradesCurricularesMock
  );
  const [turmas] = useColecaoPersistida<Turma>(CHAVES_LOCALSTORAGE.turmas, turmasMock);
  const [materias] = useColecaoPersistida<Materia>(CHAVES_LOCALSTORAGE.materias, materiasMock);
  const [professores] = useColecaoPersistida<Professor>(
    CHAVES_LOCALSTORAGE.professores,
    professoresMock
  );

  const [telaAtual, setTelaAtual] = useState<Tela>("lista");
  const [gradeEmEdicao, setGradeEmEdicao] = useState<GradeCurricular | null>(null);
  const [gradeParaExcluir, setGradeParaExcluir] = useState<GradeCurricular | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  function abrirNovaGrade() {
    setGradeEmEdicao(null);
    setTelaAtual("formulario");
  }

  function abrirEdicaoGrade(idGrade: number) {
    const grade = grades.find((item) => item.idGrade === idGrade) ?? null;
    setGradeEmEdicao(grade);
    setTelaAtual("formulario");
  }

  function cancelarFormulario() {
    setGradeEmEdicao(null);
    setTelaAtual("lista");
  }

  function adicionarGrade(dados: GradeCurricularEntrada) {
    const novaGrade: GradeCurricular = {
      ...dados,
      idGrade: proximoId(grades),
      criadoEm: agora(),
      atualizadoEm: agora(),
    };
    setGrades((atual) => [...atual, novaGrade]);
    setTelaAtual("lista");
    setMensagemSucesso("Grade curricular criada com sucesso!");
  }

  function atualizarGrade(idGrade: number, dados: GradeCurricularEntrada) {
    setGrades((atual) =>
      atual.map((grade) =>
        grade.idGrade === idGrade ? { ...grade, ...dados, atualizadoEm: agora() } : grade
      )
    );
    setGradeEmEdicao(null);
    setTelaAtual("lista");
    setMensagemSucesso("Grade curricular atualizada com sucesso!");
  }

  function handleSalvarFormulario(dados: GradeCurricularEntrada) {
    if (gradeEmEdicao) {
      atualizarGrade(gradeEmEdicao.idGrade, dados);
    } else {
      adicionarGrade(dados);
    }
  }

  /**
   * Mesma regra da constraint `uq_grade_turma_materia` do banco: uma turma
   * não pode ter a mesma matéria cadastrada duas vezes na grade curricular.
   * Roda no client antes do `salvar()` para dar feedback imediato.
   */
  function existeGradeDuplicada(turmaIdTurma: number, materiaIdMateria: number): boolean {
    return grades.some(
      (grade) =>
        grade.turmaIdTurma === turmaIdTurma &&
        grade.materiaIdMateria === materiaIdMateria &&
        grade.idGrade !== gradeEmEdicao?.idGrade
    );
  }

  function pedirConfirmacaoExclusao(idGrade: number) {
    const grade = grades.find((item) => item.idGrade === idGrade) ?? null;
    setGradeParaExcluir(grade);
  }

  function confirmarExclusao() {
    if (!gradeParaExcluir) return;
    setGrades((atual) => atual.filter((grade) => grade.idGrade !== gradeParaExcluir.idGrade));
    setGradeParaExcluir(null);
    setMensagemSucesso("Deletado com sucesso!");
  }

  function cancelarExclusao() {
    setGradeParaExcluir(null);
  }

  const materiaParaExcluir = gradeParaExcluir
    ? materias.find((materia) => materia.idMateria === gradeParaExcluir.materiaIdMateria)
    : null;
  const turmaParaExcluir = gradeParaExcluir
    ? turmas.find((turma) => turma.idTurma === gradeParaExcluir.turmaIdTurma)
    : null;

  return (
    <>
      {telaAtual === "lista" ? (
        <ListaGrades
          grades={grades}
          turmas={turmas}
          materias={materias}
          professores={professores}
          aoNovaGrade={abrirNovaGrade}
          aoEditarGrade={abrirEdicaoGrade}
          aoExcluirGrade={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioGrade
          gradeEditando={gradeEmEdicao}
          turmas={turmas}
          materias={materias}
          professores={professores}
          existeGradeDuplicada={existeGradeDuplicada}
          salvar={handleSalvarFormulario}
          cancelar={cancelarFormulario}
        />
      )}

      {gradeParaExcluir && (
        <ModalConfirmacao
          titulo="Excluir grade curricular"
          mensagem={`Tem certeza que deseja excluir a grade${
            materiaParaExcluir ? ` de "${materiaParaExcluir.nomeMateria}"` : ""
          }${turmaParaExcluir ? ` da turma "${turmaParaExcluir.nomeTurma}"` : ""}? Essa ação não pode ser desfeita.`}
          textoCancelar="Cancelar"
          textoConfirmar="Excluir"
          aoConfirmar={confirmarExclusao}
          aoCancelar={cancelarExclusao}
        />
      )}

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

export default PaginaGrades;
