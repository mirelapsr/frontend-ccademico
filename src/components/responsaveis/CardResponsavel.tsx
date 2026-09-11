import type { Responsavel } from "../../types";
import { formatarCpf } from "../../utils/formatadores";
import "./CardResponsavel.css";

interface CardResponsavelProps {
  responsavel: Responsavel;
  aoEditar: () => void;
  aoExcluir: () => void;
}

function ValorOuVazio({ valor }: { valor: string | null | undefined }) {
  if (valor) return <>{valor}</>;
  return <span className="card-responsavel__vazio">Não informado</span>;
}

function CardResponsavel({ responsavel, aoEditar, aoExcluir }: CardResponsavelProps) {
  return (
    <article className="card-responsavel">
      <header className="card-responsavel__cabecalho">
        <div className="card-responsavel__titulo-bloco">
          <h3 className="card-responsavel__nome">{responsavel.nomeResp}</h3>
          <p className="card-responsavel__cpf">
            <IconeResponsavel />
            CPF: <ValorOuVazio valor={formatarCpf(responsavel.cpfResp)} />
          </p>
        </div>

        <div className="card-responsavel__acoes">
          <button type="button" className="card-responsavel__botao-editar" onClick={aoEditar}>
            Editar
          </button>
          <button
            type="button"
            className="card-responsavel__botao-excluir"
            onClick={aoExcluir}
            aria-label={`Excluir ${responsavel.nomeResp}`}
            title="Excluir"
          >
            <IconeLixeira />
          </button>
        </div>
      </header>

      <div className="card-responsavel__corpo">
        <div className="card-responsavel__coluna">
          <span className="card-responsavel__rotulo">Telefone</span>
          <p className="card-responsavel__valor">
            <ValorOuVazio valor={responsavel.telefoneResp} />
          </p>
        </div>

        <div className="card-responsavel__coluna">
          <span className="card-responsavel__rotulo">E-mail</span>
          <p className="card-responsavel__valor">
            <ValorOuVazio valor={responsavel.emailResp} />
          </p>
        </div>
      </div>
    </article>
  );
}

export default CardResponsavel;

function IconeResponsavel() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false">
      <circle cx="10" cy="6.5" r="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M4 16.5c0-3 2.7-5.2 6-5.2s6 2.2 6 5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
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
