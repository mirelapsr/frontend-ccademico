import type { Escola, Professor } from "../../types";
import { formatarCpf } from "../../utils/formatadores";
import "./CardProfessor.css";

interface CardProfessorProps {
  professor: Professor;
  /** Lista completa de escolas — o card resolve o nome pela FK `escolaIdEscola`. */
  escolas: Escola[];
  aoEditar: () => void;
  aoExcluir: () => void;
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function ValorOuVazio({ valor }: { valor: string | null | undefined }) {
  if (valor) return <>{valor}</>;
  return <span className="card-professor__vazio">Não informado</span>;
}

function CardProfessor({ professor, escolas, aoEditar, aoExcluir }: CardProfessorProps) {
  const escolaVinculada = escolas.find((escola) => escola.idEscola === professor.escolaIdEscola);

  return (
    <article className="card-professor">
      <header className="card-professor__cabecalho">
        <div className="card-professor__titulo-bloco">
          <h3 className="card-professor__nome">{professor.nomeProf}</h3>
          <p className="card-professor__cpf">
            <IconeProfessor />
            CPF: <ValorOuVazio valor={formatarCpf(professor.cpfProf)} />
          </p>
        </div>

        <div className="card-professor__acoes">
          <span
            className={`card-professor__selo-situacao card-professor__selo-situacao--${professor.situacao.toLowerCase()}`}
          >
            {professor.situacao}
          </span>
          <button type="button" className="card-professor__botao-editar" onClick={aoEditar}>
            Editar
          </button>
          <button
            type="button"
            className="card-professor__botao-excluir"
            onClick={aoExcluir}
            aria-label={`Excluir ${professor.nomeProf}`}
            title="Excluir"
          >
            <IconeLixeira />
          </button>
        </div>
      </header>

      <div className="card-professor__corpo">
        <div className="card-professor__coluna">
          <span className="card-professor__rotulo">Contato</span>
          <p className="card-professor__valor">
            <ValorOuVazio valor={professor.telefoneProf} />
          </p>
          <p className="card-professor__valor">
            <ValorOuVazio valor={professor.emailProf} />
          </p>
        </div>

        <div className="card-professor__coluna">
          <span className="card-professor__rotulo">Instituição</span>
          <p className="card-professor__valor">
            <ValorOuVazio valor={escolaVinculada?.nomeEscola} />
          </p>
        </div>

        <div className="card-professor__coluna">
          <span className="card-professor__rotulo">Endereço</span>
          <p className="card-professor__valor">
            <ValorOuVazio valor={professor.enderecoProf} />
          </p>
          <p className="card-professor__valor">
            CEP: <ValorOuVazio valor={professor.cepProf} />
          </p>
        </div>
      </div>

      <footer className="card-professor__rodape">
        <span>Cadastrado em: {formatarData(professor.criadoEm)}</span>
        <span>Atualizado em: {formatarData(professor.atualizadoEm)}</span>
      </footer>
    </article>
  );
}

export default CardProfessor;

function IconeProfessor() {
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
