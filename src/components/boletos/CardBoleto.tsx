import type { Boleto, Aluno } from "../../types";
import "./CardBoleto.css";

interface CardBoletoProps {
  boleto: Boleto;
  aluno?: Aluno;
  aoExcluir: () => void;
}

function CardBoleto({ boleto, aluno, aoExcluir }: CardBoletoProps) {
  const formatarMoeda = (valor: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  return (
    <article className="card-boleto">
      <header className="card-boleto__cabecalho">
        <h3 className="card-boleto__numero">{boleto.numeroBoleto}</h3>
        <span className={`card-boleto__badge card-boleto__badge--${boleto.situacao.toLowerCase()}`}>
          {boleto.situacao}
        </span>
      </header>
      <div className="card-boleto__info">
        <strong>Aluno:</strong> {aluno?.nomeAluno || "Aluno não encontrado"} <br/>
        <strong>Competência:</strong> {boleto.competencia} <br/>
        <strong>Vencimento:</strong> {new Date(boleto.dataVencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} <br/>
        <strong>Valor:</strong> <span style={{ fontSize: '1.2rem', color: '#1e3a8a', fontWeight: 'bold' }}>{formatarMoeda(boleto.valorMensalidade)}</span>
      </div>
      <div className="card-boleto__acoes">
        <button type="button" className="card-boleto__botao-excluir" onClick={aoExcluir}>
          Excluir Boleto
        </button>
      </div>
    </article>
  );
}

export default CardBoleto;