import { useRef, useState, type FormEvent } from "react";
import type { Periodo, PeriodoEntrada, SituacaoPeriodo } from "../../types";
import "./FormularioPeriodo.css";

interface FormularioPeriodoProps {
  periodoEditando?: Periodo | null;
  /**
   * Persiste na API. Deve LANÇAR em caso de falha: o formulário captura,
   * mostra a mensagem no topo e continua aberto com os dados preenchidos.
   */
  salvar: (dados: PeriodoEntrada) => Promise<void>;
  cancelar: () => void;
}

const ANO_ATUAL = new Date().getFullYear();

function FormularioPeriodo({ periodoEditando, salvar, cancelar }: FormularioPeriodoProps) {
  const [nomePeriodo, setNomePeriodo] = useState(periodoEditando?.nomePeriodo ?? "");
  const [ano, setAno] = useState(periodoEditando?.ano ?? ANO_ATUAL);
  const [dataInicio, setDataInicio] = useState(periodoEditando?.dataInicio ?? "");
  const [dataFim, setDataFim] = useState(periodoEditando?.dataFim ?? "");
  const [situacao, setSituacao] = useState<SituacaoPeriodo>(
    periodoEditando?.situacao ?? "Ativo"
  );
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // `useState` é assíncrono: o ref bloqueia o 2º clique no mesmo instante.
  const emEnvioRef = useRef(false);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (emEnvioRef.current) return;

    if (!nomePeriodo.trim() || !ano || !dataInicio || !dataFim) {
      setErro("Nome, ano e as duas datas são obrigatórios.");
      return;
    }

    if (dataFim <= dataInicio) {
      setErro("A data de término deve ser posterior à data de início.");
      return;
    }

    if (!Number.isInteger(Number(ano)) || Number(ano) < 2000 || Number(ano) > 2100) {
      setErro("O ano letivo deve estar entre 2000 e 2100.");
      return;
    }

    emEnvioRef.current = true;
    setEnviando(true);
    setErro(null);
    try {
      await salvar({
        nomePeriodo: nomePeriodo.trim(),
        ano: Number(ano),
        dataInicio,
        dataFim,
        situacao,
      });
      // Sucesso: a página fecha o formulário.
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar o período.");
    } finally {
      emEnvioRef.current = false;
      setEnviando(false);
    }
  }

  return (
    <section className="formulario-periodo">
      <header className="formulario-periodo__cabecalho">
        <h2>{periodoEditando ? "Editar Período" : "Novo Período"}</h2>
      </header>

      <form className="formulario-periodo__form" onSubmit={handleSubmit} noValidate>
        {erro && (
          <p className="formulario-periodo__erro" role="alert">
            {erro}
          </p>
        )}

        <label className="formulario-periodo__campo formulario-periodo__campo--largo">
          <span>Nome do período *</span>
          <input
            value={nomePeriodo}
            onChange={(evento) => setNomePeriodo(evento.target.value)}
            maxLength={30}
            placeholder="Ex.: 1º Bimestre"
            disabled={enviando}
          />
        </label>

        <label className="formulario-periodo__campo">
          <span>Ano letivo *</span>
          <input
            type="number"
            value={ano}
            onChange={(evento) => setAno(Number(evento.target.value))}
            disabled={enviando}
          />
        </label>

        <label className="formulario-periodo__campo">
          <span>Situação *</span>
          <select
            value={situacao}
            onChange={(evento) => setSituacao(evento.target.value as SituacaoPeriodo)}
            disabled={enviando}
          >
            <option value="Ativo">Ativo</option>
            <option value="Encerrado">Encerrado</option>
          </select>
        </label>

        <label className="formulario-periodo__campo">
          <span>Data de início *</span>
          <input
            type="date"
            value={dataInicio}
            onChange={(evento) => setDataInicio(evento.target.value)}
            disabled={enviando}
          />
        </label>

        <label className="formulario-periodo__campo">
          <span>Data de término *</span>
          <input
            type="date"
            value={dataFim}
            onChange={(evento) => setDataFim(evento.target.value)}
            disabled={enviando}
          />
        </label>

        <div className="formulario-periodo__acoes">
          <button
            type="button"
            className="formulario-periodo__botao-cancelar"
            onClick={cancelar}
            disabled={enviando}
          >
            Cancelar
          </button>
          <button type="submit" className="formulario-periodo__botao-salvar" disabled={enviando}>
            {enviando ? "Salvando..." : periodoEditando ? "Salvar alterações" : "Cadastrar período"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioPeriodo;
