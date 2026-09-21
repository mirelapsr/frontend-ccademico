import type { Aluno } from "../../types";
import "./CardLancamentoNota.css";

interface CardLancamentoNotaProps {
  aluno: Aluno;
  valorNota: string;
  observacao: string;
  invalida: boolean;
  aoMudarValorNota: (valor: string) => void;
  aoMudarObservacao: (valor: string) => void;
}

function iniciais(nomeAluno: string): string {
  const partes = nomeAluno.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

function CardLancamentoNota({
  aluno,
  valorNota,
  observacao,
  invalida,
  aoMudarValorNota,
  aoMudarObservacao,
}: CardLancamentoNotaProps) {
  return (
    <article className="card-lancamento-nota">
      <div className="card-lancamento-nota__linha">
        <div className="card-lancamento-nota__aluno">
          <span className="card-lancamento-nota__avatar" aria-hidden="true">
            {iniciais(aluno.nomeAluno)}
          </span>
          <div className="card-lancamento-nota__identificacao">
            <p className="card-lancamento-nota__nome">{aluno.nomeAluno}</p>
            <p className="card-lancamento-nota__matricula">Matrícula {aluno.numeroMatricula}</p>
          </div>
        </div>

        <div className="card-lancamento-nota__campos">
          <label className="card-lancamento-nota__campo-nota">
            <span>Nota</span>
            <input
              type="number"
              min={0}
              max={10}
              step="0.1"
              value={valorNota}
              onChange={(evento) => aoMudarValorNota(evento.target.value)}
              placeholder="0,0"
              className={invalida ? "card-lancamento-nota__input-nota--invalida" : undefined}
              aria-invalid={invalida}
              aria-label={`Nota de ${aluno.nomeAluno}`}
            />
          </label>

          <label className="card-lancamento-nota__campo-observacao">
            <span>Observação</span>
            <input
              value={observacao}
              onChange={(evento) => aoMudarObservacao(evento.target.value)}
              placeholder="Ex.: Fez segunda chamada"
              aria-label={`Observação sobre a nota de ${aluno.nomeAluno}`}
            />
          </label>
        </div>
      </div>

      {invalida && (
        <p className="card-lancamento-nota__erro" role="alert">
          A nota deve estar entre 0,0 e 10,0.
        </p>
      )}
    </article>
  );
}

export default CardLancamentoNota;
