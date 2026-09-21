import { useState } from "react";
import ListaBoletins from "../components/boletins/ListaBoletins";
import FormularioBoletim from "../components/boletins/FormularioBoletim";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import { matriculasMock, alunosMock, turmasMock, periodosMock, boletinsMock } from "../mock";
import { useColecaoPersistida } from "../hooks/useColecaoPersistida";
import { CHAVES_LOCALSTORAGE } from "../storage";
import type { Boletim, BoletimEntrada, Matricula, Aluno, Turma, Periodo } from "../types";

type Tela = "lista" | "formulario";

function proximoId(boletins: Boletim[]): number {
  return boletins.reduce((maior, boletim) => Math.max(maior, boletim.idBoletim), 0) + 1;
}

function agora(): string {
  return new Date().toISOString();
}

function PaginaBoletins() {
  const [boletins, setBoletins] = useColecaoPersistida<Boletim>(
    CHAVES_LOCALSTORAGE.boletins,
    boletinsMock
  );
  const [matriculas] = useColecaoPersistida<Matricula>(CHAVES_LOCALSTORAGE.matriculas, matriculasMock);
  const [alunos] = useColecaoPersistida<Aluno>(CHAVES_LOCALSTORAGE.alunos, alunosMock);
  const [turmas] = useColecaoPersistida<Turma>(CHAVES_LOCALSTORAGE.turmas, turmasMock);
  const [periodos] = useColecaoPersistida<Periodo>(CHAVES_LOCALSTORAGE.periodos, periodosMock);

  const [telaAtual, setTelaAtual] = useState<Tela>("lista");
  const [boletimEmEdicao, setBoletimEmEdicao] = useState<Boletim | null>(null);
  const [boletimParaExcluir, setBoletimParaExcluir] = useState<Boletim | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  function abrirNovoBoletim() {
    setBoletimEmEdicao(null);
    setTelaAtual("formulario");
  }

  function abrirEdicaoBoletim(idBoletim: number) {
    const boletim = boletins.find((item) => item.idBoletim === idBoletim) ?? null;
    setBoletimEmEdicao(boletim);
    setTelaAtual("formulario");
  }

  function cancelarFormulario() {
    setBoletimEmEdicao(null);
    setTelaAtual("lista");
  }

  function adicionarBoletim(dados: BoletimEntrada) {
    const novoBoletim: Boletim = {
      ...dados,
      idBoletim: proximoId(boletins),
      criadoEm: agora(),
      atualizadoEm: agora(),
    };
    setBoletins((atual) => [...atual, novoBoletim]);
    setTelaAtual("lista");
    setMensagemSucesso("Boletim lançado com sucesso!");
  }

  function atualizarBoletim(idBoletim: number, dados: BoletimEntrada) {
    setBoletins((atual) =>
      atual.map((boletim) =>
        boletim.idBoletim === idBoletim ? { ...boletim, ...dados, atualizadoEm: agora() } : boletim
      )
    );
    setBoletimEmEdicao(null);
    setTelaAtual("lista");
    setMensagemSucesso("Boletim atualizado com sucesso!");
  }

  function handleSalvarFormulario(dados: BoletimEntrada) {
    if (boletimEmEdicao) {
      atualizarBoletim(boletimEmEdicao.idBoletim, dados);
    } else {
      adicionarBoletim(dados);
    }
  }

  /**
   * Mesma regra da constraint `uq_boletim_matricula_periodo` do banco: uma
   * matrícula não pode ter dois boletins para o mesmo período letivo. Roda
   * no client antes do `salvar()` para dar feedback imediato.
   */
  function existeBoletimDuplicado(matriculaIdMatricula: number, periodoIdPeriodo: number): boolean {
    return boletins.some(
      (boletim) =>
        boletim.matriculaIdMatricula === matriculaIdMatricula &&
        boletim.periodoIdPeriodo === periodoIdPeriodo &&
        boletim.idBoletim !== boletimEmEdicao?.idBoletim
    );
  }

  function pedirConfirmacaoExclusao(idBoletim: number) {
    const boletim = boletins.find((item) => item.idBoletim === idBoletim) ?? null;
    setBoletimParaExcluir(boletim);
  }

  function confirmarExclusao() {
    if (!boletimParaExcluir) return;
    setBoletins((atual) => atual.filter((boletim) => boletim.idBoletim !== boletimParaExcluir.idBoletim));
    setBoletimParaExcluir(null);
    setMensagemSucesso("Deletado com sucesso!");
  }

  function cancelarExclusao() {
    setBoletimParaExcluir(null);
  }

  const alunoParaExcluir = boletimParaExcluir
    ? alunos.find(
        (aluno) =>
          aluno.idAluno ===
          matriculas.find((matricula) => matricula.idMatricula === boletimParaExcluir.matriculaIdMatricula)
            ?.alunoIdAluno
      )
    : null;

  return (
    <>
      {telaAtual === "lista" ? (
        <ListaBoletins
          boletins={boletins}
          matriculas={matriculas}
          alunos={alunos}
          turmas={turmas}
          periodos={periodos}
          aoNovoBoletim={abrirNovoBoletim}
          aoEditarBoletim={abrirEdicaoBoletim}
          aoExcluirBoletim={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioBoletim
          boletimEditando={boletimEmEdicao}
          matriculas={matriculas}
          alunos={alunos}
          periodos={periodos}
          existeBoletimDuplicado={existeBoletimDuplicado}
          salvar={handleSalvarFormulario}
          cancelar={cancelarFormulario}
        />
      )}

      {boletimParaExcluir && (
        <ModalConfirmacao
          titulo="Excluir boletim"
          mensagem={`Tem certeza que deseja excluir o boletim${
            alunoParaExcluir ? ` de "${alunoParaExcluir.nomeAluno}"` : ""
          }? Essa ação não pode ser desfeita.`}
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

export default PaginaBoletins;
