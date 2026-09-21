import { useState } from "react";
import ListaAvaliacoes from "../components/avaliacoes/ListaAvaliacoes";
import FormularioAvaliacao from "../components/avaliacoes/FormularioAvaliacao";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import {
  gradesCurricularesMock,
  materiasMock,
  turmasMock,
  periodosMock,
  avaliacoesMock,
} from "../mock";
import { useColecaoPersistida } from "../hooks/useColecaoPersistida";
import { CHAVES_LOCALSTORAGE } from "../storage";
import type { Avaliacao, AvaliacaoEntrada, GradeCurricular, Materia, Turma, Periodo } from "../types";

type Tela = "lista" | "formulario";

function proximoId(avaliacoes: Avaliacao[]): number {
  return avaliacoes.reduce((maior, avaliacao) => Math.max(maior, avaliacao.idAvaliacao), 0) + 1;
}

function agora(): string {
  return new Date().toISOString();
}

function PaginaAvaliacoes() {
  const [avaliacoes, setAvaliacoes] = useColecaoPersistida<Avaliacao>(
    CHAVES_LOCALSTORAGE.avaliacoes,
    avaliacoesMock
  );
  const [grades] = useColecaoPersistida<GradeCurricular>(
    CHAVES_LOCALSTORAGE.gradesCurriculares,
    gradesCurricularesMock
  );
  const [materias] = useColecaoPersistida<Materia>(CHAVES_LOCALSTORAGE.materias, materiasMock);
  const [turmas] = useColecaoPersistida<Turma>(CHAVES_LOCALSTORAGE.turmas, turmasMock);
  const [periodos] = useColecaoPersistida<Periodo>(CHAVES_LOCALSTORAGE.periodos, periodosMock);

  const [telaAtual, setTelaAtual] = useState<Tela>("lista");
  const [avaliacaoEmEdicao, setAvaliacaoEmEdicao] = useState<Avaliacao | null>(null);
  const [avaliacaoParaExcluir, setAvaliacaoParaExcluir] = useState<Avaliacao | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  function abrirNovaAvaliacao() {
    setAvaliacaoEmEdicao(null);
    setTelaAtual("formulario");
  }

  function abrirEdicaoAvaliacao(idAvaliacao: number) {
    const avaliacao = avaliacoes.find((item) => item.idAvaliacao === idAvaliacao) ?? null;
    setAvaliacaoEmEdicao(avaliacao);
    setTelaAtual("formulario");
  }

  function cancelarFormulario() {
    setAvaliacaoEmEdicao(null);
    setTelaAtual("lista");
  }

  function adicionarAvaliacao(dados: AvaliacaoEntrada) {
    const novaAvaliacao: Avaliacao = {
      ...dados,
      idAvaliacao: proximoId(avaliacoes),
      criadoEm: agora(),
      atualizadoEm: agora(),
    };
    setAvaliacoes((atual) => [...atual, novaAvaliacao]);
    setTelaAtual("lista");
    setMensagemSucesso("Avaliação criada com sucesso!");
  }

  function atualizarAvaliacao(idAvaliacao: number, dados: AvaliacaoEntrada) {
    setAvaliacoes((atual) =>
      atual.map((avaliacao) =>
        avaliacao.idAvaliacao === idAvaliacao
          ? { ...avaliacao, ...dados, atualizadoEm: agora() }
          : avaliacao
      )
    );
    setAvaliacaoEmEdicao(null);
    setTelaAtual("lista");
    setMensagemSucesso("Avaliação atualizada com sucesso!");
  }

  function handleSalvarFormulario(dados: AvaliacaoEntrada) {
    if (avaliacaoEmEdicao) {
      atualizarAvaliacao(avaliacaoEmEdicao.idAvaliacao, dados);
    } else {
      adicionarAvaliacao(dados);
    }
  }

  function pedirConfirmacaoExclusao(idAvaliacao: number) {
    const avaliacao = avaliacoes.find((item) => item.idAvaliacao === idAvaliacao) ?? null;
    setAvaliacaoParaExcluir(avaliacao);
  }

  function confirmarExclusao() {
    if (!avaliacaoParaExcluir) return;
    setAvaliacoes((atual) =>
      atual.filter((avaliacao) => avaliacao.idAvaliacao !== avaliacaoParaExcluir.idAvaliacao)
    );
    setAvaliacaoParaExcluir(null);
    setMensagemSucesso("Deletado com sucesso!");
  }

  function cancelarExclusao() {
    setAvaliacaoParaExcluir(null);
  }

  return (
    <>
      {telaAtual === "lista" ? (
        <ListaAvaliacoes
          avaliacoes={avaliacoes}
          grades={grades}
          materias={materias}
          turmas={turmas}
          periodos={periodos}
          aoNovaAvaliacao={abrirNovaAvaliacao}
          aoEditarAvaliacao={abrirEdicaoAvaliacao}
          aoExcluirAvaliacao={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioAvaliacao
          avaliacaoEditando={avaliacaoEmEdicao}
          grades={grades}
          materias={materias}
          turmas={turmas}
          periodos={periodos}
          salvar={handleSalvarFormulario}
          cancelar={cancelarFormulario}
        />
      )}

      {avaliacaoParaExcluir && (
        <ModalConfirmacao
          titulo="Excluir avaliação"
          mensagem={`Tem certeza que deseja excluir a avaliação "${avaliacaoParaExcluir.nomeAvaliacao}"? Essa ação não pode ser desfeita.`}
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

export default PaginaAvaliacoes;
