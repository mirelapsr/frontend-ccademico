import { useCallback, useEffect, useState } from "react";
import ListaVinculos from "../components/vinculos/ListaVinculos";
import FormularioVinculo from "../components/vinculos/FormularioVinculo";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast, { type TipoToast } from "../components/ui/Toast";
import { useLista } from "../hooks/useLista";
import {
  criarVinculo,
  excluirVinculo,
  listarResponsaveisDoAluno,
  mensagemDeErroVinculo,
} from "../services/vinculoService";
import type { Aluno, Responsavel, AlunoResponsavel, AlunoResponsavelEntrada } from "../types";

type Tela = "lista" | "formulario";

interface Feedback {
  tipo: TipoToast;
  mensagem: string;
}

interface VinculoParaExcluir {
  alunoId: number;
  responsavelId: number;
  nomeAluno?: string;
  nomeResp?: string;
}

function PaginaVinculos() {
  const { dados: alunos, carregando: carregandoAlunos } = useLista<Aluno>("/alunos");
  const { dados: responsaveis, carregando: carregandoResponsaveis } = useLista<Responsavel>("/responsaveis");

  const [vinculos, setVinculos] = useState<AlunoResponsavel[]>([]);
  const [carregandoVinculos, setCarregandoVinculos] = useState(false);
  const [telaAtual, setTelaAtual] = useState<Tela>("lista");
  const [vinculoParaExcluir, setVinculoParaExcluir] = useState<VinculoParaExcluir | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const carregarTodosVinculos = useCallback(async (listaAlunos: Aluno[]) => {
    if (listaAlunos.length === 0) {
      setVinculos([]);
      return;
    }
    setCarregandoVinculos(true);
    try {
      const resultados = await Promise.all(
        listaAlunos.map((aluno) =>
          listarResponsaveisDoAluno(aluno.idAluno).catch(() => [] as AlunoResponsavel[])
        )
      );
      setVinculos(resultados.flat());
    } catch {
      setVinculos([]);
    } finally {
      setCarregandoVinculos(false);
    }
  }, []);

  useEffect(() => {
    if (!carregandoAlunos && alunos.length > 0) {
      carregarTodosVinculos(alunos);
    }
  }, [carregandoAlunos, alunos, carregarTodosVinculos]);

  const recarregarVinculos = useCallback(async () => {
    await carregarTodosVinculos(alunos);
  }, [carregarTodosVinculos, alunos]);

  const carregando = carregandoAlunos || carregandoResponsaveis || carregandoVinculos;

  function abrirNovoVinculo() {
    setTelaAtual("formulario");
  }

  function cancelarFormulario() {
    setTelaAtual("lista");
  }

  async function handleSalvarVinculo(
    alunoId: number,
    responsavelId: number,
    dados: AlunoResponsavelEntrada
  ): Promise<void> {
    try {
      await criarVinculo(alunoId, responsavelId, dados);
      setFeedback({ tipo: "sucesso", mensagem: "Vínculo criado com sucesso!" });
      cancelarFormulario();
      await recarregarVinculos();
    } catch (e: unknown) {
      throw new Error(mensagemDeErroVinculo(e, "Não foi possível cadastrar o vínculo."));
    }
  }

  function pedirConfirmacaoExclusao(idAluno: number, idResp: number) {
    const aluno = alunos.find((a) => a.idAluno === idAluno);
    const resp = responsaveis.find((r) => r.idResponsavel === idResp);
    setVinculoParaExcluir({
      alunoId: idAluno,
      responsavelId: idResp,
      nomeAluno: aluno?.nomeAluno,
      nomeResp: resp?.nomeResp,
    });
  }

  const cancelarExclusao = useCallback(() => {
    if (!excluindo) setVinculoParaExcluir(null);
  }, [excluindo]);

  async function confirmarExclusao() {
    if (!vinculoParaExcluir || excluindo) return;
    const alvo = vinculoParaExcluir;

    setExcluindo(true);
    try {
      await excluirVinculo(alvo.alunoId, alvo.responsavelId);
      setFeedback({ tipo: "sucesso", mensagem: "Vínculo removido com sucesso!" });
      await recarregarVinculos();
    } catch (e: unknown) {
      setFeedback({
        tipo: "erro",
        mensagem: mensagemDeErroVinculo(e, "Não foi possível remover o vínculo."),
      });
    } finally {
      setExcluindo(false);
      setVinculoParaExcluir(null);
    }
  }

  const fecharFeedback = useCallback(() => setFeedback(null), []);

  if (carregando && vinculos.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
        <p>Carregando vínculos...</p>
      </div>
    );
  }

  return (
    <>
      {telaAtual === "lista" ? (
        <ListaVinculos
          vinculos={vinculos}
          alunos={alunos}
          responsaveis={responsaveis}
          aoNovoVinculo={abrirNovoVinculo}
          aoExcluirVinculo={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioVinculo
          alunos={alunos}
          responsaveis={responsaveis}
          salvar={handleSalvarVinculo}
          cancelar={cancelarFormulario}
        />
      )}

      {vinculoParaExcluir && (
        <ModalConfirmacao
          titulo="Remover Vínculo"
          mensagem={`Tem certeza que deseja remover o vínculo entre "${vinculoParaExcluir.nomeAluno ?? "Aluno"}" e "${vinculoParaExcluir.nomeResp ?? "Responsável"}"?`}
          textoCancelar="Cancelar"
          textoConfirmar={excluindo ? "Removendo..." : "Remover"}
          aoConfirmar={() => void confirmarExclusao()}
          aoCancelar={cancelarExclusao}
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

export default PaginaVinculos;