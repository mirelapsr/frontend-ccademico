import { useState } from "react";
import ListaBoletos from "../components/boletos/ListaBoletos";
import FormularioBoleto from "../components/boletos/FormularioBoleto";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import { alunosMock, boletosMock } from "../mock";
import { useColecaoPersistida } from "../hooks/useColecaoPersistida";
import { CHAVES_LOCALSTORAGE } from "../storage";
import type { Aluno, Boleto, BoletoEntrada } from "../types";

export default function PaginaBoletos() {
  const [boletos, setBoletos] = useColecaoPersistida<Boleto>(CHAVES_LOCALSTORAGE.boletos, boletosMock);
  const [alunos] = useColecaoPersistida<Aluno>(CHAVES_LOCALSTORAGE.alunos, alunosMock);
  const [telaAtual, setTelaAtual] = useState<"lista" | "formulario">("lista");
  const [boletoExcluir, setBoletoExcluir] = useState<number | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  function adicionarBoleto(dados: BoletoEntrada) {
    const idBoleto = boletos.reduce((maior, b) => Math.max(maior, b.idBoleto), 0) + 1;
    setBoletos(atual => [...atual, { ...dados, idBoleto }]);
    setTelaAtual("lista");
    setMensagemSucesso("Boleto gerado com sucesso!");
  }

  function confirmarExclusao() {
    if (!boletoExcluir) return;
    setBoletos(atual => atual.filter(b => b.idBoleto !== boletoExcluir));
    setBoletoExcluir(null);
    setMensagemSucesso("Deletado com sucesso!");
  }

  return (
    <>
      {telaAtual === "lista" ? (
        <ListaBoletos
          boletos={boletos}
          alunos={alunos}
          aoNovoBoleto={() => setTelaAtual("formulario")}
          aoExcluirBoleto={(id) => setBoletoExcluir(id)}
        />
      ) : (
        <FormularioBoleto
          alunos={alunos}
          salvar={adicionarBoleto}
          cancelar={() => setTelaAtual("lista")}
        />
      )}
      {boletoExcluir && (
        <ModalConfirmacao
          titulo="Excluir Boleto"
          mensagem="Tem certeza que deseja excluir este boleto? Essa ação não pode ser desfeita."
          textoCancelar="Cancelar"
          textoConfirmar="Excluir"
          aoConfirmar={confirmarExclusao}
          aoCancelar={() => setBoletoExcluir(null)}
        />
      )}
      {mensagemSucesso && <Toast mensagem={mensagemSucesso} aoFechar={() => setMensagemSucesso(null)} />}
    </>
  );
}