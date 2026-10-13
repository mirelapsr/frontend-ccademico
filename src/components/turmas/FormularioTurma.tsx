import { useRef, useState, type FormEvent } from "react";
import type { Escola, Turma, TurmaEntrada, Turno } from "../../types";
import "./FormularioTurma.css";

interface FormularioTurmaProps {
  turmaEditando?: Turma | null;
  escolas: Escola[];
  salvar: (dados: TurmaEntrada) => Promise<void>;
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
  const [escolaId, setEscolaId] = useState(
    turmaEditando?.escolaId ?? escolas[0]?.idEscola ?? 0
  );
  const [anoLetivo, setAnoLetivo] = useState(turmaEditando?.anoLetivo ?? ANO_ATUAL);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const emEnvioRef = useRef(false);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (emEnvioRef.current) return;

    if (!nomeTurma.trim() || !escolaId || !anoLetivo) {
      setErro("Nome da turma, escola e ano letivo são obrigatórios.");
      return;
    }

    if (!Number.isInteger(Number(anoLetivo)) || Number(anoLetivo) < 2000 || Number(anoLetivo) > 2100) {
      setErro("O ano letivo deve estar entre 2000 e 2100.");
      return;
    }
    const capacidadeNumero = Number(capacidade);
    if (capacidade.trim() && (!Number.isInteger(capacidadeNumero) || capacidadeNumero <= 0)) {
      setErro("A capacidade deve ser um número inteiro maior que zero.");
      return;
    }

    emEnvioRef.current = true;
    setEnviando(true);
    setErro(null);
    try {
      await salvar({
        nomeTurma: nomeTurma.trim(),
        serie: serie.trim() || null,
        turno,
        capacidade: capacidade.trim() ? capacidadeNumero : null,
        escolaId: Number(escolaId),
        anoLetivo: Number(anoLetivo),
      });
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar a turma.");
    } finally {
      emEnvioRef.current = false;
      setEnviando(false);
    }
  }

  return (
    <section className="formulario-turma">
      <header className="formulario-turma__cabecalho">
        <h2>{turmaEditando ? "Editar Turma" : "Nova Turma"}</h2>
      </header>

      <form className="formulario-turma__form" onSubmit={handleSubmit} noValidate>
        {erro && (
          <p className="formulario-turma__erro" role="alert">
            {erro}
          </p>
        )}

        <label className="formulario-turma__campo formulario-turma__campo--largo">
          <span>Nome da turma *</span>
          <input
            value={nomeTurma}
            onChange={(evento) => setNomeTurma(evento.target.value)}
            maxLength={30}
            disabled={enviando}
            placeholder="Ex.: 9º Ano A"
          />
        </label>

        <label className="formulario-turma__campo">
          <span>Série</span>
          <input
            value={serie}
            onChange={(evento) => setSerie(evento.target.value)}
            maxLength={45}
            disabled={enviando}
            placeholder="Opcional"
          />
        </label>

        <label className="formulario-turma__campo">
          <span>Turno *</span>
          <select
            value={turno}
            onChange={(evento) => setTurno(evento.target.value as Turno)}
            disabled={enviando}
          >
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
            disabled={enviando}
            placeholder="Opcional"
          />
        </label>

        <label className="formulario-turma__campo">
          <span>Ano letivo *</span>
          <input
            type="number"
            value={anoLetivo}
            onChange={(evento) => setAnoLetivo(Number(evento.target.value))}
            disabled={enviando}
          />
        </label>

        <label className="formulario-turma__campo formulario-turma__campo--largo">
          <span>Escola *</span>
          <select
            value={escolaId}
            onChange={(evento) => setEscolaId(Number(evento.target.value))}
            disabled={enviando}
          >
            {escolas.length === 0 && <option value={0}>Nenhuma escola cadastrada</option>}
            {escolas.map((escola) => (
              <option key={escola.idEscola} value={escola.idEscola}>
                {escola.nomeEscola}
              </option>
            ))}
          </select>
        </label>

        <div className="formulario-turma__acoes">
          <button
            type="button"
            className="formulario-turma__botao-cancelar"
            onClick={cancelar}
            disabled={enviando}
          >
            Cancelar
          </button>
          <button type="submit" className="formulario-turma__botao-salvar" disabled={enviando}>
            {enviando ? "Salvando..." : turmaEditando ? "Salvar alterações" : "Cadastrar turma"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioTurma;
