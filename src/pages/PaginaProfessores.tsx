import { useCallback, useEffect, useState } from "react";
import ListaProfessores from "../components/professores/ListaProfessores";
import FormularioProfessor from "../components/professores/FormularioProfessor";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import { listarEscolas } from "../services/escolaService";
import {
  atualizarProfessor,
  criarProfessor,
  ehErroDeVinculo,
  excluirProfessor,
  listarProfessores,
  mensagemDeErroProfessor,
} from "../services/professorService";
import type { Escola, Professor, ProfessorEntrada } from "../types";

function PaginaProfessores() {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [professorEmEdicao, setProfessorEmEdicao] = useState<Professor | null>(null);

  const [professorParaExcluir, setProfessorParaExcluir] = useState<Professor | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [listaProfessores, listaEscolas] = await Promise.all([
        listarProfessores(),
        listarEscolas(),
      ]);
      setProfessores(listaProfessores);
      setEscolas(listaEscolas);
    } catch (e) {
      setErro(mensagemDeErroProfessor(e, "Não foi possível carregar os professores."));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  function abrirNovoProfessor() {
    setProfessorEmEdicao(null);
    setModalAberto(true);
  }

  function abrirEdicaoProfessor(idProfessor: number) {
    const professor = professores.find((item) => item.idProfessor === idProfessor) ?? null;
    if (!professor) return;
    setProfessorEmEdicao(professor);
    setModalAberto(true);
  }

  function cancelarFormulario() {
    setProfessorEmEdicao(null);
    setModalAberto(false);
  }

  async function salvarFormulario(dados: ProfessorEntrada): Promise<void> {
    try {
      if (professorEmEdicao) {
        const atualizado = await atualizarProfessor(professorEmEdicao.idProfessor, dados);
        setProfessores((atual) =>
          atual.map((p) => (p.idProfessor === atualizado.idProfessor ? atualizado : p))
        );
        setMensagemSucesso("Professor atualizado com sucesso!");
      } else {
        const novo = await criarProfessor(dados);
        setProfessores((atual) => [...atual, novo]);
        setMensagemSucesso("Professor criado com sucesso!");
      }
    } catch (e) {
      throw new Error(mensagemDeErroProfessor(e, "Não foi possível salvar o professor."));
    }
    cancelarFormulario();
  }

  function pedirConfirmacaoExclusao(idProfessor: number) {
    setProfessorParaExcluir(professores.find((item) => item.idProfessor === idProfessor) ?? null);
  }

  const cancelarExclusao = useCallback(() => {
    if (!excluindo) setProfessorParaExcluir(null);
  }, [excluindo]);

  async function confirmarExclusao() {
    if (!professorParaExcluir || excluindo) return;
    const alvo = professorParaExcluir;

    setExcluindo(true);
    setErro(null);
    try {
      await excluirProfessor(alvo.idProfessor);
      setProfessores((atual) => atual.filter((p) => p.idProfessor !== alvo.idProfessor));
      setMensagemSucesso("Deletado com sucesso!");
    } catch (e) {
      setErro(
        ehErroDeVinculo(e)
          ? `Não é possível excluir "${alvo.nomeProf}": o professor está vinculado a grades ` +
              `curriculares. Remova esses vínculos e tente novamente.`
          : mensagemDeErroProfessor(e, "Não foi possível excluir o professor.")
      );
    } finally {
      setExcluindo(false);
      setProfessorParaExcluir(null);
    }
  }

  const fecharToast = useCallback(() => setMensagemSucesso(null), []);

  return (
    <>
      {!modalAberto ? (
        <ListaProfessores
          professores={professores}
          escolas={escolas}
          carregando={carregando}
          erro={erro}
          aoDispensarErro={() => setErro(null)}
          aoRecarregar={() => void carregar()}
          aoNovoProfessor={abrirNovoProfessor}
          aoEditarProfessor={abrirEdicaoProfessor}
          aoExcluirProfessor={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioProfessor
          key={professorEmEdicao?.idProfessor ?? "novo"}
          professorEditando={professorEmEdicao}
          escolas={escolas}
          salvar={salvarFormulario}
          cancelar={cancelarFormulario}
        />
      )}

      {professorParaExcluir && (
        <ModalConfirmacao
          titulo="Excluir professor"
          mensagem={`Tem certeza que deseja excluir "${professorParaExcluir.nomeProf}"? Essa ação não pode ser desfeita.`}
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

export default PaginaProfessores;
