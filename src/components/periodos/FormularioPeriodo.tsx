import { useState, type FormEvent } from "react";
import type { Periodo, PeriodoEntrada, SituacaoPeriodo } from "../../types";
import "./FormularioPeriodo.css";

interface FormularioPeriodoProps {
  periodoEditando?: Periodo | null;
  salvar: (dados: PeriodoEntrada) => void;
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

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!nomePeriodo.trim() || !ano || !dataInicio || !dataFim) {
      setErro("Nome, ano e as duas datas são obrigatórios.");
      return;
    }

    if (dataFim <= dataInicio) {
      setErro("A data de término deve ser posterior à data de início.");
      return;
    }

    setErro(null);
    salvar({
      nomePeriodo: nomePeriodo.trim(),
      ano: Number(ano),
      dataInicio,
      dataFim,
      situacao,
    });
  }

  return (
    <section className="formulario-periodo">
      <header className="formulario-periodo__cabecalho">
        <h2>{periodoEditando ? "Editar Período" : "Novo Período"}</h2>
      </header>

      <form className="formulario-periodo__form" onSubmit={handleSubmit} noValidate>
        <label className="formulario-periodo__campo formulario-periodo__campo--largo">
          <span>Nome do período *</span>
          <input
            value={nomePeriodo}
            onChange={(evento) => setNomePeriodo(evento.target.value)}
            placeholder="Ex.: 1º Bimestre"
          />
        </label>

        <label className="formulario-periodo__campo">
          <span>Ano letivo *</span>
          <input
            type="number"
            value={ano}
            onChange={(evento) => setAno(Number(evento.target.value))}
          />
        </label>

        <label className="formulario-periodo__campo">
          <span>Situação *</span>
          <select
            value={situacao}
            onChange={(evento) => setSituacao(evento.target.value as SituacaoPeriodo)}
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
          />
        </label>

        <label className="formulario-periodo__campo">
          <span>Data de término *</span>
          <input
            type="date"
            value={dataFim}
            onChange={(evento) => setDataFim(evento.target.value)}
          />
        </label>

        {erro && (
          <p className="formulario-periodo__erro" role="alert">
            {erro}
          </p>
        )}

        <div className="formulario-periodo__acoes">
          <button
            type="button"
            className="formulario-periodo__botao-cancelar"
            onClick={cancelar}
          >
            Cancelar
          </button>
          <button type="submit" className="formulario-periodo__botao-salvar">
            {periodoEditando ? "Salvar alterações" : "Cadastrar período"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioPeriodo;
