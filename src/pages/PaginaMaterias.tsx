import { useState } from "react";
import ListaMaterias from "../components/materias/ListaMaterias";
import FormularioMateria from "../components/materias/FormularioMateria";
import ModalConfirmacao from "../components/ui/ModalConfirmacao";
import Toast from "../components/ui/Toast";
import { materiasMock } from "../mock";
import { useColecaoPersistida } from "../hooks/useColecaoPersistida";
import { CHAVES_LOCALSTORAGE } from "../storage";
import type { Materia, MateriaEntrada } from "../types";

type Tela = "lista" | "formulario";

function proximoId(materias: Materia[]): number {
  return materias.reduce((maior, materia) => Math.max(maior, materia.idMateria), 0) + 1;
}

function PaginaMaterias() {
  const [materias, setMaterias] = useColecaoPersistida<Materia>(
    CHAVES_LOCALSTORAGE.materias,
    materiasMock
  );

  const [telaAtual, setTelaAtual] = useState<Tela>("lista");
  const [materiaEmEdicao, setMateriaEmEdicao] = useState<Materia | null>(null);

  const [materiaParaExcluir, setMateriaParaExcluir] = useState<Materia | null>(null);

  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  function abrirNovaMateria() {
    setMateriaEmEdicao(null);
    setTelaAtual("formulario");
  }

  function abrirEdicaoMateria(idMateria: number) {
    const materia = materias.find((item) => item.idMateria === idMateria) ?? null;
    setMateriaEmEdicao(materia);
    setTelaAtual("formulario");
  }

  function cancelarFormulario() {
    setMateriaEmEdicao(null);
    setTelaAtual("lista");
  }

  function adicionarMateria(dados: MateriaEntrada) {
    const novaMateria: Materia = {
      ...dados,
      idMateria: proximoId(materias),
    };
    setMaterias((atual) => [...atual, novaMateria]);
    setTelaAtual("lista");
    setMensagemSucesso("Matéria criada com sucesso!");
  }

  function atualizarMateria(idMateria: number, dados: MateriaEntrada) {
    setMaterias((atual) =>
      atual.map((materia) => (materia.idMateria === idMateria ? { ...materia, ...dados } : materia))
    );
    setMateriaEmEdicao(null);
    setTelaAtual("lista");
    setMensagemSucesso("Matéria atualizada com sucesso!");
  }

  function handleSalvarFormulario(dados: MateriaEntrada) {
    if (materiaEmEdicao) {
      atualizarMateria(materiaEmEdicao.idMateria, dados);
    } else {
      adicionarMateria(dados);
    }
  }

  function pedirConfirmacaoExclusao(idMateria: number) {
    const materia = materias.find((item) => item.idMateria === idMateria) ?? null;
    setMateriaParaExcluir(materia);
  }

  function confirmarExclusao() {
    if (!materiaParaExcluir) return;
    setMaterias((atual) => atual.filter((materia) => materia.idMateria !== materiaParaExcluir.idMateria));
    setMateriaParaExcluir(null);
    setMensagemSucesso("Deletado com sucesso!");
  }

  function cancelarExclusao() {
    setMateriaParaExcluir(null);
  }

  return (
    <>
      {telaAtual === "lista" ? (
        <ListaMaterias
          materias={materias}
          aoNovaMateria={abrirNovaMateria}
          aoEditarMateria={abrirEdicaoMateria}
          aoExcluirMateria={pedirConfirmacaoExclusao}
        />
      ) : (
        <FormularioMateria
          materiaEditando={materiaEmEdicao}
          salvar={handleSalvarFormulario}
          cancelar={cancelarFormulario}
        />
      )}

      {materiaParaExcluir && (
        <ModalConfirmacao
          titulo="Excluir matéria"
          mensagem={`Tem certeza que deseja excluir "${materiaParaExcluir.nomeMateria}"? Essa ação não pode ser desfeita.`}
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

export default PaginaMaterias;
