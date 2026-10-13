import { useCallback, useState } from "react";
import ListaPagamentos from "../components/pagamentos/ListaPagamentos";
import FormularioPagamento from "../components/pagamentos/FormularioPagamento";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast, { type TipoToast } from "../components/ui/Toast";
import { useLista } from "../hooks/useLista";
import {
  atualizarPagamento,
  criarPagamento,
  excluirPagamento,
  mensagemDeErroPagamento,
} from "../services/pagamentoService";
import type { Aluno, Boleto, BoletoEntrada } from "../types";

interface Feedback {
  tipo: TipoToast;
  mensagem: string;
}

export default function PaginaPagamentos() {
  const {
    dados: pagamentos,
    carregando: carregandoPagamentos,
    erro: erroPagamentos,
    recarregar: recarregarPagamentos,
  } = useLista<Boleto>("/boletos");

  const {
    dados: alunos,
    carregando: carregandoAlunos,
    erro: erroAlunos,
  } = useLista<Aluno>("/alunos");

  const [telaAtual, setTelaAtual] = useState<"lista" | "formulario">("lista");
  const [pagamentoExcluir, setPagamentoExcluir] = useState<number | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const carregando = carregandoPagamentos || carregandoAlunos;
  const erroGeral = erroPagamentos ?? erroAlunos;

  async function adicionarPagamento(dados: BoletoEntrada): Promise<void> {
    try {
      await criarPagamento(dados);
      setFeedback({ tipo: "sucesso", mensagem: "Cobrança cadastrada com sucesso!" });
      setTelaAtual("lista");
      await recarregarPagamentos();
    } catch (e: unknown) {
      throw new Error(mensagemDeErroPagamento(e, "Não foi possível cadastrar a cobrança."));
    }
  }

  async function handleDarBaixa(idBoleto: number): Promise<void> {
    try {
      const hoje = new Date().toISOString().slice(0, 10);
      await atualizarPagamento(idBoleto, {
        situacao: "Pago",
        dataPagamento: hoje,
      } as Partial<BoletoEntrada>);
      setFeedback({ tipo: "sucesso", mensagem: "Pagamento baixado com sucesso!" });
      await recarregarPagamentos();
    } catch (e: unknown) {
      setFeedback({
        tipo: "erro",
        mensagem: mensagemDeErroPagamento(e, "Erro ao dar baixa no pagamento."),
      });
    }
  }

  async function confirmarExclusao() {
    if (!pagamentoExcluir || excluindo) return;
    const id = pagamentoExcluir;

    setExcluindo(true);
    try {
      await excluirPagamento(id);
      setFeedback({ tipo: "sucesso", mensagem: "Pagamento excluído com sucesso!" });
      await recarregarPagamentos();
    } catch (e: unknown) {
      setFeedback({
        tipo: "erro",
        mensagem: mensagemDeErroPagamento(e, "Não foi possível excluir o pagamento."),
      });
    } finally {
      setExcluindo(false);
      setPagamentoExcluir(null);
    }
  }

  const fecharFeedback = useCallback(() => setFeedback(null), []);

  if (carregando && pagamentos.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
        <p>Carregando pagamentos...</p>
      </div>
    );
  }

  return (
    <>
      {erroGeral && (
        <div
          style={{
            margin: "0 0 16px",
            padding: "10px 12px",
            background: "#fbeae9",
            color: "#a4302b",
            borderRadius: "4px",
          }}
        >
          {erroGeral}
        </div>
      )}

      {telaAtual === "lista" ? (
        <ListaPagamentos
          pagamentos={pagamentos}
          alunos={alunos}
          aoNovoPagamento={() => setTelaAtual("formulario")}
          aoDarBaixaPagamento={(id) => void handleDarBaixa(id)}
          aoExcluirPagamento={(id) => setPagamentoExcluir(id)}
        />
      ) : (
        <FormularioPagamento
          alunos={alunos}
          salvar={adicionarPagamento}
          cancelar={() => setTelaAtual("lista")}
        />
      )}

      {pagamentoExcluir && (
        <ModalConfirmacao
          titulo="Excluir Pagamento"
          mensagem="Tem certeza que deseja excluir este pagamento? Essa ação não pode ser desfeita."
          textoCancelar="Cancelar"
          textoConfirmar={excluindo ? "Excluindo..." : "Excluir"}
          aoConfirmar={() => void confirmarExclusao()}
          aoCancelar={() => !excluindo && setPagamentoExcluir(null)}
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