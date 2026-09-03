import { useState, type FormEvent } from "react";
import type { Escola, Turma, TurmaEntrada, Turno } from "../../types";
import "./FormularioTurma.css";

interface FormularioTurmaProps {
  turmaEditando?: Turma | null;
  /** Escolas disponíveis no mock, usadas para preencher o <select> de instituição. */
  escolas: Escola[];
  salvar: (dados: TurmaEntrada) => void;
  cancelar: () => void;
}

const ANO_ATUAL = new Date().getFullYear();

function FormularioTurma({ turmaEditando, escolas, salvar, cancelar }: FormularioTurmaProps) {
  const [nomeTurma, setNomeTurma] = useState(turmaEditando?.nomeTurma ?? "");
  const [serie, setSerie] = useState(turmaEditando?.serie ?? "");
  const [turno, setTurno] = useState<Turno>(turmaEditando?.turno ?? "Manha");
  const [capacidade, setCapacidade] = useState(
    turmaEditando?.capacidade !== null && turmaEditando?.capacidade !== undefined
      ? String(turmaEditando.capacidade)
      : ""
  );
  const [escolaIdEscola, setEscolaIdEscola] = useState(
    turmaEditando?.escolaIdEscola ?? escolas[0]?.idEscola ?? 0
  );
  const [anoLetivo, setAnoLetivo] = useState(turmaEditando?.anoLetivo ?? ANO_ATUAL);
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!nomeTurma.trim() || !escolaIdEscola || !anoLetivo) {
      setErro("Nome da turma, escola e ano letivo são obrigatórios.");
      return;
    }

    setErro(null);
    salvar({
      nomeTurma: nomeTurma.trim(),
      serie: serie.trim() || null,
      turno,
      capacidade: capacidade.trim() ? Number(capacidade) : null,
      escolaIdEscola: Number(escolaIdEscola),
      anoLetivo: Number(anoLetivo),
    });
  }

  return (
    <section className="formulario-turma">
      <header className="formulario-turma__cabecalho">
        <h2>{turmaEditando ? "Editar Turma" : "Nova Turma"}</h2>
      </header>

      <form className="formulario-turma__form" onSubmit={handleSubmit} noValidate>
        <label className="formulario-turma__campo formulario-turma__campo--largo">
          <span>Nome da turma *</span>
          <input
            value={nomeTurma}
            onChange={(evento) => setNomeTurma(evento.target.value)}
            placeholder="Ex.: 9º Ano A"
          />
        </label>

        <label className="formulario-turma__campo">
          <span>Série</span>
          <input
            value={serie}
            onChange={(evento) => setSerie(evento.target.value)}
            placeholder="Opcional"
          />
        </label>

        <label className="formulario-turma__campo">
          <span>Turno *</span>
          <select value={turno} onChange={(evento) => setTurno(evento.target.value as Turno)}>
            <option value="Manha">Manhã</option>
            <option value="Tarde">Tarde</option>
            <option value="Noite">Noite</option>
            <option value="Integral">Integral</option>
          </select>
        </label>

        <label className="formulario-turma__campo">
          <span>Capacidade</span>
          <input
            type="number"
            min={1}
            value={capacidade}
            onChange={(evento) => setCapacidade(evento.target.value)}
            placeholder="Opcional"
          />
        </label>

        <label className="formulario-turma__campo">
          <span>Ano letivo *</span>
          <input
            type="number"
            value={anoLetivo}
            onChange={(evento) => setAnoLetivo(Number(evento.target.value))}
          />
        </label>

        <label className="formulario-turma__campo formulario-turma__campo--largo">
          <span>Escola *</span>
          <select
            value={escolaIdEscola}
            onChange={(evento) => setEscolaIdEscola(Number(evento.target.value))}
          >
            {escolas.length === 0 && <option value={0}>Nenhuma escola cadastrada</option>}
            {escolas.map((escola) => (
              <option key={escola.idEscola} value={escola.idEscola}>
                {escola.nomeEscola}
              </option>
            ))}
          </select>
        </label>

        {erro && (
          <p className="formulario-turma__erro" role="alert">
            {erro}
          </p>
        )}

        <div className="formulario-turma__acoes">
          <button
            type="button"
            className="formulario-turma__botao-cancelar"
            onClick={cancelar}
          >
            Cancelar
          </button>
          <button type="submit" className="formulario-turma__botao-salvar">
            {turmaEditando ? "Salvar alterações" : "Cadastrar turma"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioTurma;
