import type { Escola } from "../../types";
import "./CardEscola.css";

interface CardEscolaProps {
  escola: Escola;
  aoEditar: () => void;
  aoExcluir: () => void;
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function extrairCidadeEstado(endereco: string | null): string | null {
  if (!endereco) return null;
  const partes = endereco.split(",");
  const ultimaParte = partes[partes.length - 1]?.trim();
  return ultimaParte || null;
}

function ValorOuVazio({ valor }: { valor: string | null | undefined }) {
  if (valor) return <>{valor}</>;
  return <span className="card-escola__vazio">Não informado</span>;
}

function CardEscola({ escola, aoEditar, aoExcluir }: CardEscolaProps) {
  const cidadeEstado = extrairCidadeEstado(escola.enderecoEscola);

  return (
    <article className="card-escola">
      <header className="card-escola__cabecalho">
        <div className="card-escola__titulo-bloco">
          <h3 className="card-escola__nome">{escola.nomeEscola}</h3>
          <p className="card-escola__local">
            <IconeLocalizacao />
            <ValorOuVazio valor={cidadeEstado} />
          </p>
        </div>

        <div className="card-escola__acoes">
          <button type="button" className="card-escola__botao-editar" onClick={aoEditar}>
            Editar
          </button>
          <button
            type="button"
            className="card-escola__botao-excluir"
            onClick={aoExcluir}
            aria-label={`Excluir ${escola.nomeEscola}`}
            title="Excluir"
          >
            <IconeLixeira />
          </button>
        </div>
      </header>

      <div className="card-escola__corpo">
        <div className="card-escola__coluna">
          <span className="card-escola__rotulo">Endereço</span>
          <p className="card-escola__valor">
            <ValorOuVazio valor={escola.enderecoEscola} />
          </p>
        </div>

        <div className="card-escola__coluna">
          <span className="card-escola__rotulo">Contato</span>
          <p className="card-escola__valor">
            <ValorOuVazio valor={escola.telefoneEscola} />
          </p>
          <p className="card-escola__valor">
            <ValorOuVazio valor={escola.emailEscola} />
          </p>
        </div>

        <div className="card-escola__coluna">
          <span className="card-escola__rotulo">Identificação</span>
          <div className="card-escola__selos">
            <span className="card-escola__selo">
              CNPJ: <ValorOuVazio valor={escola.cnpj} />
            </span>
            <span className="card-escola__selo">
              INEP: <ValorOuVazio valor={escola.codigoInep} />
            </span>
          </div>
        </div>
      </div>

      <footer className="card-escola__rodape">
        <span>Cadastrada em: {formatarData(escola.criadoEm)}</span>
        <span>Atualizada em: {formatarData(escola.atualizadoEm)}</span>
      </footer>
    </article>
  );
}

export default CardEscola;

function IconeLocalizacao() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false">
      <path
        d="M10 1.5c-3.04 0-5.5 2.4-5.5 5.36 0 3.98 5.5 11.14 5.5 11.14s5.5-7.16 5.5-11.14c0-2.96-2.46-5.36-5.5-5.36Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="10" cy="6.9" r="1.9" fill="currentColor" />
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
