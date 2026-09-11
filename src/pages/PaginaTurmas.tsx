import { useState } from "react";
import ListaTurmas from "../components/turmas/ListaTurmas";
import FormularioTurma from "../components/turmas/FormularioTurma";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import { escolasMock, turmasMock } from "../mock";
import { useColecaoPersistida } from "../hooks/useColecaoPersistida";
import { CHAVES_LOCALSTORAGE } from "../storage";
import type { Escola, Turma, TurmaEntrada } from "../types";

type Tela = "lista" | "formulario";

function proximoId(turmas: Turma[]): number {
  return turmas.reduce((maior, turma) => Math.max(maior, turma.idTurma), 0) + 1;
}

function agora(): string {
  return new Date().toISOString();
}

function PaginaTurmas() {
  const [turmas, setTurmas] = useColecaoPersistida<Turma>(CHAVES_LOCALSTORAGE.turmas, turmasMock);
  const [escolas] = useColecaoPersistida<Escola>(CHAVES_LOCALSTORAGE.escolas, escolasMock);
  const [telaAtual, setTelaAtual] = useState<Tela>("lista");
  const [turmaEmEdicao, setTurmaEmEdicao] = useState<Turma | null>(null);

  const [turmaParaExcluir, setTurmaParaExcluir] = useState<Turma | null>(null);

  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  function abrirNovaTurma() {
    setTurmaEmEdicao(null);
    setTelaAtual("formulario");
  }

  function abrirEdicaoTurma(idTurma: number) {
    const turma = turmas.find((item) => item.idTurma === idTurma) ?? null;
    setTurmaEmEdicao(turma);
    setTelaAtual("formulario");
  }

  function cancelarFormulario() {
    setTurmaEmEdicao(null);
    setTelaAtual("lista");
  }

  function adicionarTurma(dados: TurmaEntrada) {
    const novaTurma: Turma = {
      ...dados,
      idTurma: proximoId(turmas),
      criadoEm: agora(),
      atualizadoEm: agora(),
    };
    setTurmas((atual) => [...atual, novaTurma]);
    setTelaAtual("lista");
    setMensagemSucesso("Turma criada com sucesso!");
  }

  function atualizarTurma(idTurma: number, dados: TurmaEntrada) {
    setTurmas((atual) =>
      atual.map((turma) =>
        turma.idTurma === idTurma ? { ...turma, ...dados, atualizadoEm: agora() } : turma
      )
    );
    setTurmaEmEdicao(null);
    setTelaAtual("lista");
    setMensagemSucesso("Turma atualizada com sucesso!");
  }

  function handleSalvarFormulario(dados: TurmaEntrada) {
    if (turmaEmEdicao) {
      atualizarTurma(turmaEmEdicao.idTurma, dados);
    } else {
      adicionarTurma(dados);
    }
  }

  function pedirConfirmacaoExclusao(idTurma: number) {
    const turma = turmas.find((item) => item.idTurma === idTurma) ?? null;
    setTurmaParaExcluir(turma);
  }

  function confirmarExclusao() {
    if (!turmaParaExcluir) return;
    setTurmas((atual) => atual.filter((turma) => turma.idTurma !== turmaParaExcluir.idTurma));
    setTurmaParaExcluir(null);
    setMensagemSucesso("Deletado com sucesso!");
  }

  function cancelarExclusao() {
    setTurmaParaExcluir(null);
  }

  return (
    <>
      {telaAtual === "lista" ? (
        <ListaTurmas
          turmas={turmas}
          escolas={escolas}
          aoNovaTurma={abrirNovaTurma}
          aoEditarTurma={abrirEdicaoTurma}
          aoExcluirTurma={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioTurma
          turmaEditando={turmaEmEdicao}
          escolas={escolas}
          salvar={handleSalvarFormulario}
          cancelar={cancelarFormulario}
        />
      )}

      {turmaParaExcluir && (
        <ModalConfirmacao
          titulo="Excluir turma"
          mensagem={`Tem certeza que deseja excluir "${turmaParaExcluir.nomeTurma}"? Essa ação não pode ser desfeita.`}
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

export default PaginaTurmas;
