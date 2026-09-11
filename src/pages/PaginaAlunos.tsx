import { useState } from "react";
import ListaAlunos from "../components/alunos/ListaAlunos";
import FormularioAluno from "../components/alunos/FormularioAluno";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import { alunosMock } from "../mock";
import { useColecaoPersistida } from "../hooks/useColecaoPersistida";
import { CHAVES_LOCALSTORAGE } from "../storage";
import type { Aluno, AlunoEntrada } from "../types";

type Tela = "lista" | "formulario";

function proximoId(alunos: Aluno[]): number {
  return alunos.reduce((maior, aluno) => Math.max(maior, aluno.idAluno), 0) + 1;
}

function agora(): string {
  return new Date().toISOString();
}

function PaginaAlunos() {
  const [alunos, setAlunos] = useColecaoPersistida<Aluno>(CHAVES_LOCALSTORAGE.alunos, alunosMock);
  const [telaAtual, setTelaAtual] = useState<Tela>("lista");
  const [alunoEmEdicao, setAlunoEmEdicao] = useState<Aluno | null>(null);

  const [alunoParaExcluir, setAlunoParaExcluir] = useState<Aluno | null>(null);

  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  function abrirNovoAluno() {
    setAlunoEmEdicao(null);
    setTelaAtual("formulario");
  }

  function abrirEdicaoAluno(idAluno: number) {
    const aluno = alunos.find((item) => item.idAluno === idAluno) ?? null;
    setAlunoEmEdicao(aluno);
    setTelaAtual("formulario");
  }

  function cancelarFormulario() {
    setAlunoEmEdicao(null);
    setTelaAtual("lista");
  }

  function adicionarAluno(dados: AlunoEntrada) {
    const novoAluno: Aluno = {
      ...dados,
      idAluno: proximoId(alunos),
      criadoEm: agora(),
      atualizadoEm: agora(),
    };
    setAlunos((atual) => [...atual, novoAluno]);
    setTelaAtual("lista");
    setMensagemSucesso("Aluno criado com sucesso!");
  }

  function atualizarAluno(idAluno: number, dados: AlunoEntrada) {
    setAlunos((atual) =>
      atual.map((aluno) =>
        aluno.idAluno === idAluno ? { ...aluno, ...dados, atualizadoEm: agora() } : aluno
      )
    );
    setAlunoEmEdicao(null);
    setTelaAtual("lista");
    setMensagemSucesso("Aluno atualizado com sucesso!");
  }

  function handleSalvarFormulario(dados: AlunoEntrada) {
    if (alunoEmEdicao) {
      atualizarAluno(alunoEmEdicao.idAluno, dados);
    } else {
      adicionarAluno(dados);
    }
  }

  function pedirConfirmacaoExclusao(idAluno: number) {
    const aluno = alunos.find((item) => item.idAluno === idAluno) ?? null;
    setAlunoParaExcluir(aluno);
  }

  function confirmarExclusao() {
    if (!alunoParaExcluir) return;
    setAlunos((atual) => atual.filter((aluno) => aluno.idAluno !== alunoParaExcluir.idAluno));
    setAlunoParaExcluir(null);
    setMensagemSucesso("Deletado com sucesso!");
  }

  function cancelarExclusao() {
    setAlunoParaExcluir(null);
  }

  return (
    <>
      {telaAtual === "lista" ? (
        <ListaAlunos
          alunos={alunos}
          aoNovoAluno={abrirNovoAluno}
          aoEditarAluno={abrirEdicaoAluno}
          aoExcluirAluno={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioAluno
          alunoEditando={alunoEmEdicao}
          salvar={handleSalvarFormulario}
          cancelar={cancelarFormulario}
        />
      )}

      {alunoParaExcluir && (
        <ModalConfirmacao
          titulo="Excluir aluno"
          mensagem={`Tem certeza que deseja excluir "${alunoParaExcluir.nomeAluno}"? Essa ação não pode ser desfeita.`}
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

export default PaginaAlunos;
