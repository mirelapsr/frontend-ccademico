import { useState } from "react";
import ListaEscolas from "../components/escolas/ListaEscolas";
import FormularioEscola from "../components/escolas/FormularioEscola";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import { escolasMock } from "../mock";
import { useColecaoPersistida } from "../hooks/useColecaoPersistida";
import { CHAVES_LOCALSTORAGE } from "../storage";
import type { Escola, EscolaEntrada } from "../types";

type Tela = "lista" | "formulario";

function proximoId(escolas: Escola[]): number {
  return escolas.reduce((maior, escola) => Math.max(maior, escola.idEscola), 0) + 1;
}


function agora(): string {
  return new Date().toISOString();
}


function PaginaEscolas() {
  const [escolas, setEscolas] = useColecaoPersistida<Escola>(
    CHAVES_LOCALSTORAGE.escolas,
    escolasMock
  );
  const [telaAtual, setTelaAtual] = useState<Tela>("lista");
  const [escolaEmEdicao, setEscolaEmEdicao] = useState<Escola | null>(null);


  const [escolaParaExcluir, setEscolaParaExcluir] = useState<Escola | null>(null);


  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  function abrirNovaEscola() {
    setEscolaEmEdicao(null);
    setTelaAtual("formulario");
  }

  function abrirEdicaoEscola(idEscola: number) {
    const escola = escolas.find((item) => item.idEscola === idEscola) ?? null;
    setEscolaEmEdicao(escola);
    setTelaAtual("formulario");
  }

  function cancelarFormulario() {
    setEscolaEmEdicao(null);
    setTelaAtual("lista");
  }

  function adicionarEscola(dados: EscolaEntrada) {
    const novaEscola: Escola = {
      ...dados,
      idEscola: proximoId(escolas),
      criadoEm: agora(),
      atualizadoEm: agora(),
    };
    setEscolas((atual) => [...atual, novaEscola]);
    setTelaAtual("lista");
    setMensagemSucesso("Escola criada com sucesso!");
  }

  function atualizarEscola(idEscola: number, dados: EscolaEntrada) {
    setEscolas((atual) =>
      atual.map((escola) =>
        escola.idEscola === idEscola
          ? 
            { ...escola, ...dados, atualizadoEm: agora() }
          : escola
      )
    );
    setEscolaEmEdicao(null);
    setTelaAtual("lista");
    setMensagemSucesso("Escola atualizada com sucesso!");
  }

 
  function handleSalvarFormulario(dados: EscolaEntrada) {
    if (escolaEmEdicao) {
      atualizarEscola(escolaEmEdicao.idEscola, dados);
    } else {
      adicionarEscola(dados);
    }
  }


  function pedirConfirmacaoExclusao(idEscola: number) {
    const escola = escolas.find((item) => item.idEscola === idEscola) ?? null;
    setEscolaParaExcluir(escola);
  }

  function confirmarExclusao() {
    if (!escolaParaExcluir) return;
    setEscolas((atual) =>
      atual.filter((escola) => escola.idEscola !== escolaParaExcluir.idEscola)
    );
    setEscolaParaExcluir(null);
    setMensagemSucesso("Deletado com sucesso!");
  }

  function cancelarExclusao() {
    setEscolaParaExcluir(null);
  }

  return (
    <>
      {telaAtual === "lista" ? (
        <ListaEscolas
          escolas={escolas}
          aoNovaEscola={abrirNovaEscola}
          aoEditarEscola={abrirEdicaoEscola}
          aoExcluirEscola={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioEscola
          escolaEditando={escolaEmEdicao}
          salvar={handleSalvarFormulario}
          cancelar={cancelarFormulario}
        />
      )}

      {escolaParaExcluir && (
        <ModalConfirmacao
          titulo="Excluir escola"
          mensagem={`Tem certeza que deseja excluir "${escolaParaExcluir.nomeEscola}"? Essa ação não pode ser desfeita.`}
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

export default PaginaEscolas;
