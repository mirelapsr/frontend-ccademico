import type { Avaliacao, TipoAvaliacao } from "../../types";
import "./CardAvaliacaoResumo.css";

interface CardAvaliacaoResumoProps {
  avaliacao: Avaliacao;
  nomeMateria: string;
  media: number | null;
  notasLancadas: number;
  totalAlunos: number;
  aoLancarNotas: () => void;
}

function formatarData(iso: string | null | undefined): string {
  if (!iso) return "A definir";
  return new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString("pt-BR");
}

function formatarPeso(peso: number | null | undefined): string {
  if (peso === null || peso === undefined) return "1,00";
  return peso.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatarMedia(media: number | null): string {
  if (media === null) return "—";
  return media.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

const RUTULOS_TIPO: Record<TipoAvaliacao, string> = {
  Prova: "Prova",
  Trabalho: "Trabalho",
  Seminario: "Seminário",
  Participacao: "Participação",
  Outro: "Outro",
};

function CardAvaliacaoResumo({
  avaliacao,
  nomeMateria,
  media,
  notasLancadas,
  totalAlunos,
  aoLancarNotas,
}: CardAvaliacaoResumoProps) {
  const completo = totalAlunos > 0 && notasLancadas >= totalAlunos;

  return (
    <article className="card-avaliacao-resumo">
      <header className="card-avaliacao-resumo__cabecalho">
        <div className="card-avaliacao-resumo__titulo-bloco">
          <h3 className="card-avaliacao-resumo__nome">{avaliacao.nomeAvaliacao}</h3>
          <p className="card-avaliacao-resumo__subtitulo">{nomeMateria}</p>
        </div>
        <span
          className={`card-avaliacao-resumo__selo-tipo card-avaliacao-resumo__selo-tipo--${avaliacao.tipo.toLowerCase()}`}
        >
          {RUTULOS_TIPO[avaliacao.tipo]}
        </span>
      </header>

      <div className="card-avaliacao-resumo__corpo">
        <div className="card-avaliacao-resumo__coluna">
          <span className="card-avaliacao-resumo__rotulo">Data</span>
          <p className="card-avaliacao-resumo__valor">{formatarData(avaliacao.dataAvaliacao)}</p>
        </div>

        <div className="card-avaliacao-resumo__coluna">
          <span className="card-avaliacao-resumo__rotulo">Peso</span>
          <p className="card-avaliacao-resumo__valor">{formatarPeso(avaliacao.peso)}</p>
        </div>

        <div className="card-avaliacao-resumo__coluna">
          <span className="card-avaliacao-resumo__rotulo">Média da turma</span>
          <p className="card-avaliacao-resumo__valor card-avaliacao-resumo__valor--destaque">
            {formatarMedia(media)}
          </p>
        </div>
      </div>

      <div className="card-avaliacao-resumo__rodape">
        <span
          className={`card-avaliacao-resumo__progresso${
            completo ? " card-avaliacao-resumo__progresso--completo" : ""
          }`}
        >
          {notasLancadas} de {totalAlunos} notas lançadas
        </span>
        <button type="button" className="card-avaliacao-resumo__botao" onClick={aoLancarNotas}>
          Editar Notas
        </button>
      </div>
    </article>
  );
}

export default CardAvaliacaoResumo;
