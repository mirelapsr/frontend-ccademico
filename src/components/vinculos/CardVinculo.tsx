import type { Aluno, Responsavel, AlunoResponsavel } from "../../types";
import "./CardVinculo.css";

interface CardVinculoProps {
  vinculo: AlunoResponsavel;
  aluno?: Aluno;
  responsavel?: Responsavel;
  aoExcluir: () => void;
}

function CardVinculo({ vinculo, aluno, responsavel, aoExcluir }: CardVinculoProps) {
  return (
    <article className="card-vinculo">
      <header className="card-vinculo__cabecalho">
        <h3 className="card-vinculo__nome">{aluno?.nomeAluno || "Aluno não encontrado"}</h3>
        {vinculo.responsavelFinanceiro && (
          <span className="card-vinculo__badge-financeiro">💰 Resp. Financeiro</span>
        )}
      </header>
      <p className="card-vinculo__info">
        <strong>Responsável:</strong> {responsavel?.nomeResp || "Não encontrado"} <br/>
        <strong>Parentesco:</strong> {vinculo.tipoResponsavel}
      </p>
      <div className="card-vinculo__acoes">
        <button type="button" className="card-vinculo__botao-excluir" onClick={aoExcluir}>
          Remover Vínculo
        </button>
      </div>
    </article>
  );
}

export default CardVinculo;