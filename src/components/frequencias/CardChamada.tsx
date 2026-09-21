import type { Aluno, StatusFrequencia } from "../../types";
import "./CardChamada.css";

interface CardChamadaProps {
  aluno: Aluno;
  status: StatusFrequencia;
  justificativa: string;
  aoMudarStatus: (status: StatusFrequencia) => void;
  aoMudarJustificativa: (justificativa: string) => void;
}

const OPCOES_STATUS: { valor: StatusFrequencia; rotulo: string }[] = [
  { valor: "Presente", rotulo: "Presente" },
  { valor: "Ausente", rotulo: "Ausente" },
  { valor: "Justificado", rotulo: "Justificado" },
];

function CardChamada({
  aluno,
  status,
  justificativa,
  aoMudarStatus,
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
          {OPCOES_STATUS.map((opcao) => (
            <button
              key={opcao.valor}
              type="button"
              aria-pressed={status === opcao.valor}
              className={`card-chamada__opcao card-chamada__opcao--${opcao.valor.toLowerCase()}${
                status === opcao.valor ? " card-chamada__opcao--ativa" : ""
              }`}
              onClick={() => aoMudarStatus(opcao.valor)}
            >
              {opcao.rotulo}
            </button>
          ))}
        </div>
      </div>

      {status === "Justificado" && (
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
