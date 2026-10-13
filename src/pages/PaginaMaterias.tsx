import { useCallback, useEffect, useState } from "react";
import ListaMaterias from "../components/materias/ListaMaterias";
import FormularioMateria from "../components/materias/FormularioMateria";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import {
  atualizarMateria,
  criarMateria,
  ehErroDeVinculo,
  excluirMateria,
  listarMaterias,
  mensagemDeErroMateria,
  type CriarMateriaDTO,
} from "../services/materiaService";
import type { Materia } from "../types";

function PaginaMaterias() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [materiaEmEdicao, setMateriaEmEdicao] = useState<Materia | null>(null);

  const [materiaParaExcluir, setMateriaParaExcluir] = useState<Materia | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  // --- Carregamento ----------------------------------------------------------

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setMaterias(await listarMaterias());
    } catch (e) {
      setErro(mensagemDeErroMateria(e, "Não foi possível carregar as matérias."));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  // --- Formulário (criar / editar) ---------------------------------------------

  function abrirNovaMateria() {
    setMateriaEmEdicao(null);
    setModalAberto(true);
  }

  function abrirEdicaoMateria(idMateria: number) {
    const materia = materias.find((item) => item.idMateria === idMateria) ?? null;
    if (!materia) return;
    setMateriaEmEdicao(materia);
    setModalAberto(true);
  }

  function cancelarFormulario() {
    setMateriaEmEdicao(null);
    setModalAberto(false);
  }

  
  async function salvarFormulario(dados: CriarMateriaDTO): Promise<void> {
    try {
      if (materiaEmEdicao) {
        const atualizada = await atualizarMateria(materiaEmEdicao.idMateria, dados);
        setMaterias((atual) =>
          atual.map((m) => (m.idMateria === atualizada.idMateria ? atualizada : m))
        );
        setMensagemSucesso("Matéria atualizada com sucesso!");
      } else {
        const nova = await criarMateria(dados);
        setMaterias((atual) => [...atual, nova]);
        setMensagemSucesso("Matéria criada com sucesso!");
      }
    } catch (e) {
      throw new Error(mensagemDeErroMateria(e, "Não foi possível salvar a matéria."));
    }
    cancelarFormulario();
  }

  // --- Exclusão ------------------------------------------------------------------

  function pedirConfirmacaoExclusao(idMateria: number) {
    setMateriaParaExcluir(materias.find((item) => item.idMateria === idMateria) ?? null);
  }

  const cancelarExclusao = useCallback(() => {
    if (!excluindo) setMateriaParaExcluir(null);
  }, [excluindo]);

  async function confirmarExclusao() {
    if (!materiaParaExcluir || excluindo) return;
    const alvo = materiaParaExcluir;

    setExcluindo(true);
    setErro(null);
    try {
      await excluirMateria(alvo.idMateria);
      setMaterias((atual) => atual.filter((m) => m.idMateria !== alvo.idMateria));
      setMensagemSucesso("Deletado com sucesso!");
    } catch (e) {
      setErro(
        ehErroDeVinculo(e)
          ? `Não é possível excluir "${alvo.nomeMateria}": a matéria está vinculada a grades ` +
              `curriculares ou boletins. Remova esses vínculos e tente novamente.`
          : mensagemDeErroMateria(e, "Não foi possível excluir a matéria.")
      );
    } finally {
      setExcluindo(false);
      setMateriaParaExcluir(null);
    }
  }

  const fecharToast = useCallback(() => setMensagemSucesso(null), []);

  return (
    <>
      {!modalAberto ? (
        <ListaMaterias
          materias={materias}
          carregando={carregando}
          erro={erro}
          aoDispensarErro={() => setErro(null)}
          aoRecarregar={() => void carregar()}
          aoNovaMateria={abrirNovaMateria}
          aoEditarMateria={abrirEdicaoMateria}
          aoExcluirMateria={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioMateria
          key={materiaEmEdicao?.idMateria ?? "nova"}
          materiaEditando={materiaEmEdicao}
          salvar={salvarFormulario}
          cancelar={cancelarFormulario}
        />
      )}

      {materiaParaExcluir && (
        <ModalConfirmacao
          titulo="Excluir matéria"
          mensagem={`Tem certeza que deseja excluir "${materiaParaExcluir.nomeMateria}"? Essa ação não pode ser desfeita.`}
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

export default PaginaMaterias;
