import type { Aluno, Responsavel, AlunoResponsavel } from "../../types";
import "./CardVinculo.css";

interface CardVinculoProps {
  vinculo: AlunoResponsavel;
  aluno?: Aluno;
  responsavel?: Responsavel;
  aoExcluir: () => void;
}

const RUTULOS_PARENTESCO: Record<AlunoResponsavel["tipoResponsavel"], string> = {
  Pai: "Pai",
  Mae: "Mãe",
  ResponsavelLegal: "Responsável Legal",
  Outro: "Outro",
};

function ValorOuVazio({ valor }: { valor: string | null | undefined }) {
  if (valor) return <>{valor}</>;
  return <span className="card-vinculo__vazio">Não informado</span>;
}

function CardVinculo({ vinculo, aluno, responsavel, aoExcluir }: CardVinculoProps) {
  return (
    <article className="card-vinculo">
      <header className="card-vinculo__cabecalho">
        <div className="card-vinculo__titulo-bloco">
          <h3 className="card-vinculo__nome">
            <ValorOuVazio valor={aluno?.nomeAluno} />
          </h3>
          <p className="card-vinculo__subtitulo">
            <IconeVinculo />
            Vínculo com responsável
          </p>
        </div>

        <div className="card-vinculo__acoes">
          {vinculo.responsavelFinanceiro && (
            <span className="card-vinculo__selo-financeiro">Responsável Financeiro</span>
          )}
          <button
            type="button"
            className="card-vinculo__botao-excluir"
            onClick={aoExcluir}
            aria-label={`Remover vínculo de ${aluno?.nomeAluno ?? "aluno"}`}
            title="Remover vínculo"
          >
            <IconeLixeira />
          </button>
        </div>
      </header>

      <div className="card-vinculo__corpo">
        <div className="card-vinculo__coluna">
          <span className="card-vinculo__rotulo">Responsável</span>
          <p className="card-vinculo__valor">
            <ValorOuVazio valor={responsavel?.nomeResp} />
          </p>
        </div>

        <div className="card-vinculo__coluna">
          <span className="card-vinculo__rotulo">Grau de parentesco</span>
          <p className="card-vinculo__valor">{RUTULOS_PARENTESCO[vinculo.tipoResponsavel]}</p>
        </div>

        <div className="card-vinculo__coluna">
          <span className="card-vinculo__rotulo">Contato</span>
          <p className="card-vinculo__valor">
            <ValorOuVazio valor={responsavel?.telefoneResp} />
          </p>
          <p className="card-vinculo__valor card-vinculo__valor--suave">
            <ValorOuVazio valor={responsavel?.emailResp} />
          </p>
        </div>
      </div>
    </article>
  );
}

export default CardVinculo;

function IconeVinculo() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false">
      <circle cx="6" cy="7" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="14" cy="13" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 8.6 12 11.4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconeLixeira() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" focusable="false">
      <path
        d="M4 6h12M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6M5.5 6l.6 10.2a1.5 1.5 0 0 0 1.5 1.4h4.8a1.5 1.5 0 0 0 1.5-1.4L14.5 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
