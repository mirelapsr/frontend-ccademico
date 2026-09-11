import { useState } from "react";
import ListaPeriodos from "../components/periodos/ListaPeriodos";
import FormularioPeriodo from "../components/periodos/FormularioPeriodo";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import { periodosMock } from "../mock";
import { useColecaoPersistida } from "../hooks/useColecaoPersistida";
import { CHAVES_LOCALSTORAGE } from "../storage";
import type { Periodo, PeriodoEntrada } from "../types";

type Tela = "lista" | "formulario";

function proximoId(periodos: Periodo[]): number {
  return periodos.reduce((maior, periodo) => Math.max(maior, periodo.idPeriodo), 0) + 1;
}

function agora(): string {
  return new Date().toISOString();
}

function PaginaPeriodos() {
  const [periodos, setPeriodos] = useColecaoPersistida<Periodo>(
    CHAVES_LOCALSTORAGE.periodos,
    periodosMock
  );

  const [telaAtual, setTelaAtual] = useState<Tela>("lista");
  const [periodoEmEdicao, setPeriodoEmEdicao] = useState<Periodo | null>(null);

  const [periodoParaExcluir, setPeriodoParaExcluir] = useState<Periodo | null>(null);

  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  function abrirNovoPeriodo() {
    setPeriodoEmEdicao(null);
    setTelaAtual("formulario");
  }

  function abrirEdicaoPeriodo(idPeriodo: number) {
    const periodo = periodos.find((item) => item.idPeriodo === idPeriodo) ?? null;
    setPeriodoEmEdicao(periodo);
    setTelaAtual("formulario");
  }

  function cancelarFormulario() {
    setPeriodoEmEdicao(null);
    setTelaAtual("lista");
  }

  function adicionarPeriodo(dados: PeriodoEntrada) {
    const novoPeriodo: Periodo = {
      ...dados,
      idPeriodo: proximoId(periodos),
      criadoEm: agora(),
      atualizadoEm: agora(),
    };
    setPeriodos((atual) => [...atual, novoPeriodo]);
    setTelaAtual("lista");
    setMensagemSucesso("Período criado com sucesso!");
  }

  function atualizarPeriodo(idPeriodo: number, dados: PeriodoEntrada) {
    setPeriodos((atual) =>
      atual.map((periodo) =>
        periodo.idPeriodo === idPeriodo
          ? { ...periodo, ...dados, atualizadoEm: agora() }
          : periodo
      )
    );
    setPeriodoEmEdicao(null);
    setTelaAtual("lista");
    setMensagemSucesso("Período atualizado com sucesso!");
  }

  function handleSalvarFormulario(dados: PeriodoEntrada) {
    if (periodoEmEdicao) {
      atualizarPeriodo(periodoEmEdicao.idPeriodo, dados);
    } else {
      adicionarPeriodo(dados);
    }
  }

  function pedirConfirmacaoExclusao(idPeriodo: number) {
    const periodo = periodos.find((item) => item.idPeriodo === idPeriodo) ?? null;
    setPeriodoParaExcluir(periodo);
  }

  function confirmarExclusao() {
    if (!periodoParaExcluir) return;
    setPeriodos((atual) =>
      atual.filter((periodo) => periodo.idPeriodo !== periodoParaExcluir.idPeriodo)
    );
    setPeriodoParaExcluir(null);
    setMensagemSucesso("Deletado com sucesso!");
  }

  function cancelarExclusao() {
    setPeriodoParaExcluir(null);
  }

  return (
    <>
      {telaAtual === "lista" ? (
        <ListaPeriodos
          periodos={periodos}
          aoNovoPeriodo={abrirNovoPeriodo}
          aoEditarPeriodo={abrirEdicaoPeriodo}
          aoExcluirPeriodo={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioPeriodo
          periodoEditando={periodoEmEdicao}
          salvar={handleSalvarFormulario}
          cancelar={cancelarFormulario}
        />
      )}

      {periodoParaExcluir && (
        <ModalConfirmacao
          titulo="Excluir período"
          mensagem={`Tem certeza que deseja excluir "${periodoParaExcluir.nomePeriodo}"? Essa ação não pode ser desfeita.`}
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

export default PaginaPeriodos;
