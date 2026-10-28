import type { Escola } from "../../types";
import {
  OPCOES_TURNO,
  filtrosEstaoNoPadrao,
  FILTROS_PADRAO,
  type FiltroAno,
  type FiltroTurno,
  type FiltrosDashboard as Filtros,
} from "../../utils/dashboard";

interface FiltrosDashboardProps {
  filtros: Filtros;
  escolas: readonly Escola[];
  anosDisponiveis: readonly number[];
  aoMudar: (filtros: Filtros) => void;
  desabilitado?: boolean;
}

function FiltrosDashboard({
  filtros,
  escolas,
  anosDisponiveis,
  aoMudar,
  desabilitado = false,
}: FiltrosDashboardProps) {
  const noPadrao = filtrosEstaoNoPadrao(filtros);

  return (
    <section className="filtros-dashboard" aria-label="Filtros globais do dashboard">
      <div className="filtros-dashboard__campo">
        <label htmlFor="filtro-escola">Escola</label>
        <select
          id="filtro-escola"
          value={filtros.escolaId ?? ""}
          disabled={desabilitado}
          onChange={(e) =>
            aoMudar({ ...filtros, escolaId: e.target.value === "" ? null : Number(e.target.value) })
          }
        >
          <option value="">Todas as Escolas</option>
          {escolas.map((escola) => (
            <option key={escola.idEscola} value={escola.idEscola}>
              {escola.nomeEscola}
            </option>
          ))}
        </select>
      </div>

      <div className="filtros-dashboard__campo">
        <label htmlFor="filtro-ano">Ano letivo</label>
        <select
          id="filtro-ano"
          value={String(filtros.anoLetivo)}
          disabled={desabilitado}
          onChange={(e) => {
            const valor = e.target.value;
            const anoLetivo: FiltroAno = valor === "Todos" ? "Todos" : Number(valor);
            aoMudar({ ...filtros, anoLetivo });
          }}
        >
          <option value="Todos">Todos os anos</option>
          {anosDisponiveis.map((ano) => (
            <option key={ano} value={ano}>
              {ano}
            </option>
          ))}
        </select>
      </div>

      <div className="filtros-dashboard__campo filtros-dashboard__campo--turno">
        <span id="rotulo-turno">Turno</span>
        <div className="filtros-dashboard__chips" role="radiogroup" aria-labelledby="rotulo-turno">
          {OPCOES_TURNO.map((opcao) => {
            const ativo = filtros.turno === opcao.valor;
            return (
              <button
                key={opcao.valor}
                type="button"
                role="radio"
                aria-checked={ativo}
                disabled={desabilitado}
                className={ativo ? "chip-turno chip-turno--ativo" : "chip-turno"}
                onClick={() => aoMudar({ ...filtros, turno: opcao.valor as FiltroTurno })}
              >
                {opcao.rotulo}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="filtros-dashboard__limpar"
        disabled={noPadrao}
        onClick={() => aoMudar(FILTROS_PADRAO)}
      >
        Limpar filtros
      </button>
    </section>
  );
}

export default FiltrosDashboard;
