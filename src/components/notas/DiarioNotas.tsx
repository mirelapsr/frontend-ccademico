import type { Avaliacao, Aluno, Matricula } from "../../types";
import CardLancamentoNota from "./CardLancamentoNota";
import "./DiarioNotas.css";

export interface LinhaLancamento {
  matricula: Matricula;
  aluno: Aluno;
  valorNota: string;
  observacao: string;
  invalida: boolean;
}

interface DiarioNotasProps {
  avaliacao: Avaliacao;
  nomeMateria: string;
  nomeTurma: string;
  linhas: LinhaLancamento[];
  aoVoltar: () => void;
  aoMudarValorNota: (idMatricula: number, valor: string) => void;
  aoMudarObservacao: (idMatricula: number, valor: string) => void;
  aoAbrirModalNotaGeral: () => void;
  aoSalvar: () => void;
}

function DiarioNotas({
  avaliacao,
  nomeMateria,
  nomeTurma,
  linhas,
  aoVoltar,
  aoMudarValorNota,
  aoMudarObservacao,
  aoAbrirModalNotaGeral,
  aoSalvar,
}: DiarioNotasProps) {
  return (
    <section className="diario-notas">
      <button type="button" className="diario-notas__botao-voltar" onClick={aoVoltar}>
        ← Voltar para Avaliações
      </button>

      <header className="diario-notas__cabecalho">
        <div className="diario-notas__titulo-bloco">
          <h2 className="diario-notas__titulo">{avaliacao.nomeAvaliacao}</h2>
          <p className="diario-notas__subtitulo">
            {nomeTurma} · {nomeMateria}
          </p>
        </div>

        <div className="diario-notas__acoes">
          <button
            type="button"
            className="diario-notas__botao-secundario"
            onClick={aoAbrirModalNotaGeral}
          >
            Aplicar Nota para Todos
          </button>
          <button type="button" className="diario-notas__botao-salvar" onClick={aoSalvar}>
            Salvar Alterações
          </button>
        </div>
      </header>

      {linhas.length === 0 ? (
        <p className="diario-notas__vazio-geral">
          Nenhum aluno com matrícula ativa nesta turma.
        </p>
      ) : (
        <div className="diario-notas__linhas">
          {linhas.map(({ matricula, aluno, valorNota, observacao, invalida }) => (
            <CardLancamentoNota
              key={matricula.idMatricula}
              aluno={aluno}
              valorNota={valorNota}
              observacao={observacao}
              invalida={invalida}
              aoMudarValorNota={(valor) => aoMudarValorNota(matricula.idMatricula, valor)}
              aoMudarObservacao={(valor) => aoMudarObservacao(matricula.idMatricula, valor)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default DiarioNotas;
