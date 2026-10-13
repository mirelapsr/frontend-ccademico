import type { Aluno, SituacaoFrequencia } from "../../types";
import "./CardChamada.css";

interface CardChamadaProps {
  aluno: Aluno;
  situacao: SituacaoFrequencia;
  justificativa: string;
  aoMudarSituacao: (situacao: SituacaoFrequencia) => void;
  aoMudarJustificativa: (justificativa: string) => void;
}

const OPCOES_SITUACAO: { valor: SituacaoFrequencia; rotulo: string; classeCss: string }[] = [
  { valor: "Presente", rotulo: "Presente", classeCss: "presente" },
  { valor: "Falta", rotulo: "Ausente", classeCss: "ausente" },
  { valor: "FaltaJustificada", rotulo: "Justificado", classeCss: "justificado" },
];

function CardChamada({
  aluno,
  situacao,
  justificativa,
  aoMudarSituacao,
  aoMudarJustificativa,
}: CardChamadaProps) {
  return (
    <article className="card-chamada">
      <div className="card-chamada__linha">
        <div className="card-chamada__aluno">
          <p className="card-chamada__nome">{aluno.nomeAluno}</p>
          <p className="card-chamada__matricula">Matrícula {aluno.numeroMatricula}</p>
        </div>

        <div className="card-chamada__opcoes" role="group" aria-label={`Presença de ${aluno.nomeAluno}`}>
          {OPCOES_SITUACAO.map((opcao) => (
            <button
              key={opcao.valor}
              type="button"
              aria-pressed={situacao === opcao.valor}
              className={`card-chamada__opcao card-chamada__opcao--${opcao.classeCss}${
                situacao === opcao.valor ? " card-chamada__opcao--ativa" : ""
              }`}
              onClick={() => aoMudarSituacao(opcao.valor)}
            >
              {opcao.rotulo}
            </button>
          ))}
        </div>
      </div>

      {situacao === "FaltaJustificada" && (
        <label className="card-chamada__justificativa">
          <span>Motivo da justificativa</span>
          <input
            value={justificativa}
            onChange={(evento) => aoMudarJustificativa(evento.target.value)}
            placeholder="Ex.: Atestado médico"
          />
        </label>
      )}
    </article>
  );
}

export default CardChamada;