import { useState } from "react";
import ListaPagamentos from "../components/pagamentos/ListaPagamentos";
import FormularioPagamento from "../components/pagamentos/FormularioPagamento";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import { alunosMock, boletosMock } from "../mock";
import { useColecaoPersistida } from "../hooks/useColecaoPersistida";
import { CHAVES_LOCALSTORAGE } from "../storage";
import type { Aluno, Boleto, BoletoEntrada } from "../types";

export default function PaginaPagamentos() {
  const [pagamentos, setPagamentos] = useColecaoPersistida<Boleto>(CHAVES_LOCALSTORAGE.boletos, boletosMock);
  const [alunos] = useColecaoPersistida<Aluno>(CHAVES_LOCALSTORAGE.alunos, alunosMock);
  const [telaAtual, setTelaAtual] = useState<"lista" | "formulario">("lista");
  const [pagamentoExcluir, setPagamentoExcluir] = useState<number | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  function adicionarPagamento(dados: BoletoEntrada) {
    const idBoleto = pagamentos.reduce((maior, p) => Math.max(maior, p.idBoleto), 0) + 1;
    setPagamentos(atual => [...atual, { ...dados, idBoleto }]);
    setTelaAtual("lista");
    setMensagemSucesso("Pagamento registrado com sucesso!");
  }

  function confirmarExclusao() {
    if (!pagamentoExcluir) return;
    setPagamentos(atual => atual.filter(p => p.idBoleto !== pagamentoExcluir));
    setPagamentoExcluir(null);
    setMensagemSucesso("Deletado com sucesso!");
  }

  return (
    <>
      {telaAtual === "lista" ? (
        <ListaPagamentos
          pagamentos={pagamentos}
          alunos={alunos}
          aoNovoPagamento={() => setTelaAtual("formulario")}
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
          textoConfirmar="Excluir"
          aoConfirmar={confirmarExclusao}
          aoCancelar={() => setPagamentoExcluir(null)}
        />
      )}
      {mensagemSucesso && <Toast mensagem={mensagemSucesso} aoFechar={() => setMensagemSucesso(null)} />}
    </>
  );
}