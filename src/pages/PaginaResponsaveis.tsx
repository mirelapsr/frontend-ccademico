import { useState } from "react";
import ListaResponsaveis from "../components/responsaveis/ListaResponsaveis";
import FormularioResponsavel from "../components/responsaveis/FormularioResponsavel";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import { responsaveisMock } from "../mock";
import { useColecaoPersistida } from "../hooks/useColecaoPersistida";
import { CHAVES_LOCALSTORAGE } from "../storage";
import type { Responsavel, ResponsavelEntrada } from "../types";

type Tela = "lista" | "formulario";

function proximoId(responsaveis: Responsavel[]): number {
  return (
    responsaveis.reduce((maior, responsavel) => Math.max(maior, responsavel.idResponsavel), 0) + 1
  );
}

function agora(): string {
  return new Date().toISOString();
}

function PaginaResponsaveis() {
  const [responsaveis, setResponsaveis] = useColecaoPersistida<Responsavel>(
    CHAVES_LOCALSTORAGE.responsaveis,
    responsaveisMock
  );

  const [telaAtual, setTelaAtual] = useState<Tela>("lista");
  const [responsavelEmEdicao, setResponsavelEmEdicao] = useState<Responsavel | null>(null);

  const [responsavelParaExcluir, setResponsavelParaExcluir] = useState<Responsavel | null>(null);

  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  function abrirNovoResponsavel() {
    setResponsavelEmEdicao(null);
    setTelaAtual("formulario");
  }

  function abrirEdicaoResponsavel(idResponsavel: number) {
    const responsavel = responsaveis.find((item) => item.idResponsavel === idResponsavel) ?? null;
    setResponsavelEmEdicao(responsavel);
    setTelaAtual("formulario");
  }

  function cancelarFormulario() {
    setResponsavelEmEdicao(null);
    setTelaAtual("lista");
  }

  function adicionarResponsavel(dados: ResponsavelEntrada) {
    const novoResponsavel: Responsavel = {
      ...dados,
      idResponsavel: proximoId(responsaveis),
      criadoEm: agora(),
      atualizadoEm: agora(),
    };
    setResponsaveis((atual) => [...atual, novoResponsavel]);
    setTelaAtual("lista");
    setMensagemSucesso("Responsável criado com sucesso!");
  }

  function atualizarResponsavel(idResponsavel: number, dados: ResponsavelEntrada) {
    setResponsaveis((atual) =>
      atual.map((responsavel) =>
        responsavel.idResponsavel === idResponsavel
          ? { ...responsavel, ...dados, atualizadoEm: agora() }
          : responsavel
      )
    );
    setResponsavelEmEdicao(null);
    setTelaAtual("lista");
    setMensagemSucesso("Responsável atualizado com sucesso!");
  }

  function handleSalvarFormulario(dados: ResponsavelEntrada) {
    if (responsavelEmEdicao) {
      atualizarResponsavel(responsavelEmEdicao.idResponsavel, dados);
    } else {
      adicionarResponsavel(dados);
    }
  }

  function pedirConfirmacaoExclusao(idResponsavel: number) {
    const responsavel = responsaveis.find((item) => item.idResponsavel === idResponsavel) ?? null;
    setResponsavelParaExcluir(responsavel);
  }

  function confirmarExclusao() {
    if (!responsavelParaExcluir) return;
    setResponsaveis((atual) =>
      atual.filter((responsavel) => responsavel.idResponsavel !== responsavelParaExcluir.idResponsavel)
    );
    setResponsavelParaExcluir(null);
    setMensagemSucesso("Deletado com sucesso!");
  }

  function cancelarExclusao() {
    setResponsavelParaExcluir(null);
  }

  return (
    <>
      {telaAtual === "lista" ? (
        <ListaResponsaveis
          responsaveis={responsaveis}
          aoNovoResponsavel={abrirNovoResponsavel}
          aoEditarResponsavel={abrirEdicaoResponsavel}
          aoExcluirResponsavel={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioResponsavel
          responsavelEditando={responsavelEmEdicao}
          salvar={handleSalvarFormulario}
          cancelar={cancelarFormulario}
        />
      )}

      {responsavelParaExcluir && (
        <ModalConfirmacao
          titulo="Excluir responsável"
          mensagem={`Tem certeza que deseja excluir "${responsavelParaExcluir.nomeResp}"? Essa ação não pode ser desfeita.`}
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

export default PaginaResponsaveis;
