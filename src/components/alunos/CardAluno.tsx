import type { Aluno } from "../../types";
import { formatarCpf } from "../../utils/formatadores";
import "./CardAluno.css";

interface CardAlunoProps {
  aluno: Aluno;
  /** "Nome da Turma (Turno)" da matrícula ativa do aluno, ou undefined se não houver. */
  nomeTurma?: string;
  aoEditar: () => void;
  aoExcluir: () => void;
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function formatarDataNascimento(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR");
}

function ValorOuVazio({
  valor,
  rotuloVazio = "Não informado",
}: {
  valor: string | null | undefined;
  rotuloVazio?: string;
}) {
  if (valor) return <>{valor}</>;
  return <span className="card-aluno__vazio">{rotuloVazio}</span>;
}

function CardAluno({ aluno, nomeTurma, aoEditar, aoExcluir }: CardAlunoProps) {
  return (
    <article className="card-aluno">
      <header className="card-aluno__cabecalho">
        <div className="card-aluno__titulo-bloco">
          <h3 className="card-aluno__nome">{aluno.nomeAluno}</h3>
          <p className="card-aluno__matricula">
            <IconeMatricula />
            Matrícula {aluno.numeroMatricula}
            <span className="card-aluno__separador" aria-hidden="true">
              •
            </span>
            <IconeTurma />
            {nomeTurma ? (
              nomeTurma
            ) : (
              <ValorOuVazio valor={undefined} rotuloVazio="Sem turma" />
            )}
          </p>
        </div>

        <div className="card-aluno__acoes">
          <span className={`card-aluno__selo-situacao card-aluno__selo-situacao--${aluno.situacao.toLowerCase()}`}>
            {aluno.situacao}
          </span>
          <button type="button" className="card-aluno__botao-editar" onClick={aoEditar}>
            Editar
          </button>
          <button
            type="button"
            className="card-aluno__botao-excluir"
            onClick={aoExcluir}
            aria-label={`Excluir ${aluno.nomeAluno}`}
            title="Excluir"
          >
            <IconeLixeira />
          </button>
        </div>
      </header>

      <div className="card-aluno__corpo">
        <div className="card-aluno__coluna">
          <span className="card-aluno__rotulo">Contato</span>
          <p className="card-aluno__valor">
            <ValorOuVazio valor={aluno.telefoneAluno} />
          </p>
          <p className="card-aluno__valor">
            <ValorOuVazio valor={aluno.emailAluno} />
          </p>
        </div>

        <div className="card-aluno__coluna">
          <span className="card-aluno__rotulo">Documentação</span>
          <div className="card-aluno__selos">
            <span className="card-aluno__selo">
              CPF: <ValorOuVazio valor={formatarCpf(aluno.cpfAluno)} />
            </span>
            <span className="card-aluno__selo">
              Nascimento: {formatarDataNascimento(aluno.dataNascimento)}
            </span>
          </div>
        </div>

        <div className="card-aluno__coluna">
          <span className="card-aluno__rotulo">Endereço</span>
          <p className="card-aluno__valor">
            <ValorOuVazio valor={aluno.enderecoAluno} />
          </p>
          <p className="card-aluno__valor">
            CEP: <ValorOuVazio valor={aluno.cepAluno} />
          </p>
        </div>
      </div>

      <footer className="card-aluno__rodape">
        <span>Cadastrado em: {formatarData(aluno.criadoEm)}</span>
        <span>Atualizado em: {formatarData(aluno.atualizadoEm)}</span>
      </footer>
    </article>
  );
}

export default CardAluno;

function IconeMatricula() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" focusable="false">
      <rect x="2.5" y="4" width="15" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="7.2" cy="9" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.8 13c.4-1.5 1.5-2.2 2.4-2.2s2 .7 2.4 2.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="12" y1="8" x2="15.2" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="12" y1="11" x2="15.2" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function IconeTurma() {
  return (
    <svg viewBox="0 0 20 20" width="13" height="13" aria-hidden="true" focusable="false">
      <path
        d="M10 3.2 17 6.8 10 10.4 3 6.8 10 3.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 8.6v4.2c0 1 2 2.4 4.5 2.4s4.5-1.4 4.5-2.4V8.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
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