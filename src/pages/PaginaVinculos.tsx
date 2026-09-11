import { useState } from "react";
import ListaVinculos from "../components/vinculos/ListaVinculos";
import FormularioVinculo from "../components/vinculos/FormularioVinculo";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import { alunosMock, vinculosMock } from "../mock";
import { useColecaoPersistida } from "../hooks/useColecaoPersistida";
import { CHAVES_LOCALSTORAGE } from "../storage";
import type { Aluno, Responsavel, AlunoResponsavel, AlunoResponsavelEntrada } from "../types";

export default function PaginaVinculos() {
  const [vinculos, setVinculos] = useColecaoPersistida<AlunoResponsavel>(CHAVES_LOCALSTORAGE.vinculos, vinculosMock);
  const [alunos] = useColecaoPersistida<Aluno>(CHAVES_LOCALSTORAGE.alunos, alunosMock);
  const [responsaveis] = useColecaoPersistida<Responsavel>(CHAVES_LOCALSTORAGE.responsaveis, []);
  const [telaAtual, setTelaAtual] = useState<"lista" | "formulario">("lista");
  const [vinculoExcluir, setVinculoExcluir] = useState<{ aId: number; rId: number } | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  function adicionarVinculo(dados: AlunoResponsavelEntrada) {
    const existe = vinculos.find(v => v.alunoIdAluno === dados.alunoIdAluno && v.responsavelIdResponsavel === dados.responsavelIdResponsavel);
    if (existe) {
      alert("Este vínculo já existe!");
      return;
    }
    setVinculos(atual => [...atual, dados]);
    setTelaAtual("lista");
    setMensagemSucesso("Vínculo criado com sucesso!");
  }

  function confirmarExclusao() {
    if (!vinculoExcluir) return;
    setVinculos(atual => atual.filter(v => !(v.alunoIdAluno === vinculoExcluir.aId && v.responsavelIdResponsavel === vinculoExcluir.rId)));
    setVinculoExcluir(null);
    setMensagemSucesso("Deletado com sucesso!");
  }

  return (
    <>
      {telaAtual === "lista" ? (
        <ListaVinculos
          vinculos={vinculos}
          alunos={alunos}
          responsaveis={responsaveis}
          aoNovoVinculo={() => setTelaAtual("formulario")}
          aoExcluirVinculo={(aId, rId) => setVinculoExcluir({ aId, rId })}
        />
      ) : (
        <FormularioVinculo
          alunos={alunos}
          responsaveis={responsaveis}
          salvar={adicionarVinculo}
          cancelar={() => setTelaAtual("lista")}
        />
      )}
      {vinculoExcluir && (
        <ModalConfirmacao
          titulo="Remover Vínculo"
          mensagem="Tem certeza que deseja remover este vínculo? O responsável não terá mais acesso aos dados deste aluno."
          textoCancelar="Cancelar"
          textoConfirmar="Excluir"
          aoConfirmar={confirmarExclusao}
          aoCancelar={() => setVinculoExcluir(null)}
        />
      )}
      {mensagemSucesso && <Toast mensagem={mensagemSucesso} aoFechar={() => setMensagemSucesso(null)} />}
    </>
  );
}