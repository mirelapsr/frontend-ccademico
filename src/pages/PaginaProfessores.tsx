import { useState } from "react";
import ListaProfessores from "../components/professores/ListaProfessores";
import FormularioProfessor from "../components/professores/FormularioProfessor";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import { escolasMock, professoresMock } from "../mock";
import { useColecaoPersistida } from "../hooks/useColecaoPersistida";
import { CHAVES_LOCALSTORAGE } from "../storage";
import type { Escola, Professor, ProfessorEntrada } from "../types";

type Tela = "lista" | "formulario";

function proximoId(professores: Professor[]): number {
  return professores.reduce((maior, professor) => Math.max(maior, professor.idProfessor), 0) + 1;
}

function agora(): string {
  return new Date().toISOString();
}

function PaginaProfessores() {
  const [professores, setProfessores] = useColecaoPersistida<Professor>(
    CHAVES_LOCALSTORAGE.professores,
    professoresMock
  );
  const [escolas] = useColecaoPersistida<Escola>(CHAVES_LOCALSTORAGE.escolas, escolasMock);

  const [telaAtual, setTelaAtual] = useState<Tela>("lista");
  const [professorEmEdicao, setProfessorEmEdicao] = useState<Professor | null>(null);

  const [professorParaExcluir, setProfessorParaExcluir] = useState<Professor | null>(null);

  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  function abrirNovoProfessor() {
    setProfessorEmEdicao(null);
    setTelaAtual("formulario");
  }

  function abrirEdicaoProfessor(idProfessor: number) {
    const professor = professores.find((item) => item.idProfessor === idProfessor) ?? null;
    setProfessorEmEdicao(professor);
    setTelaAtual("formulario");
  }

  function cancelarFormulario() {
    setProfessorEmEdicao(null);
    setTelaAtual("lista");
  }

  function adicionarProfessor(dados: ProfessorEntrada) {
    const novoProfessor: Professor = {
      ...dados,
      idProfessor: proximoId(professores),
      criadoEm: agora(),
      atualizadoEm: agora(),
    };
    setProfessores((atual) => [...atual, novoProfessor]);
    setTelaAtual("lista");
    setMensagemSucesso("Professor criado com sucesso!");
  }

  function atualizarProfessor(idProfessor: number, dados: ProfessorEntrada) {
    setProfessores((atual) =>
      atual.map((professor) =>
        professor.idProfessor === idProfessor
          ? { ...professor, ...dados, atualizadoEm: agora() }
          : professor
      )
    );
    setProfessorEmEdicao(null);
    setTelaAtual("lista");
    setMensagemSucesso("Professor atualizado com sucesso!");
  }

  function handleSalvarFormulario(dados: ProfessorEntrada) {
    if (professorEmEdicao) {
      atualizarProfessor(professorEmEdicao.idProfessor, dados);
    } else {
      adicionarProfessor(dados);
    }
  }

  function pedirConfirmacaoExclusao(idProfessor: number) {
    const professor = professores.find((item) => item.idProfessor === idProfessor) ?? null;
    setProfessorParaExcluir(professor);
  }

  function confirmarExclusao() {
    if (!professorParaExcluir) return;
    setProfessores((atual) =>
      atual.filter((professor) => professor.idProfessor !== professorParaExcluir.idProfessor)
    );
    setProfessorParaExcluir(null);
    setMensagemSucesso("Deletado com sucesso!");
  }

  function cancelarExclusao() {
    setProfessorParaExcluir(null);
  }

  return (
    <>
      {telaAtual === "lista" ? (
        <ListaProfessores
          professores={professores}
          escolas={escolas}
          aoNovoProfessor={abrirNovoProfessor}
          aoEditarProfessor={abrirEdicaoProfessor}
          aoExcluirProfessor={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioProfessor
          professorEditando={professorEmEdicao}
          escolas={escolas}
          salvar={handleSalvarFormulario}
          cancelar={cancelarFormulario}
        />
      )}

      {professorParaExcluir && (
        <ModalConfirmacao
          titulo="Excluir professor"
          mensagem={`Tem certeza que deseja excluir "${professorParaExcluir.nomeProf}"? Essa ação não pode ser desfeita.`}
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

export default PaginaProfessores;
