import { useState } from "react";
import type { Aluno, Boleto, SituacaoBoleto } from "../../types";
import CardPagamento from "./CardPagamento";

interface ListaPagamentosProps {
  pagamentos: Boleto[];
  alunos: Aluno[];
  aoNovoPagamento: () => void;
  aoExcluirPagamento: (idBoleto: number) => void;
}

function ListaPagamentos({ pagamentos, alunos, aoNovoPagamento, aoExcluirPagamento }: ListaPagamentosProps) {
  const [busca, setBusca] = useState("");
  const [filtroSituacao, setFiltroSituacao] = useState<"todas" | SituacaoBoleto>("todas");

  const pagamentosFiltrados = pagamentos.filter(p => {
    const aluno = alunos.find(a => a.idAluno === p.alunoIdAluno);
    const termo = busca.toLowerCase();
    const combinaBusca = p.numeroBoleto.toLowerCase().includes(termo) || aluno?.nomeAluno.toLowerCase().includes(termo);
    const combinaFiltro = filtroSituacao === "todas" || p.situacao === filtroSituacao;
    return combinaBusca && combinaFiltro;
  });

  return (
    <section>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2>Controle de Pagamentos</h2>
        <button onClick={aoNovoPagamento}>+ Novo Pagamento</button>
      </header>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input 
          type="search" 
          value={busca} 
          onChange={(e) => setBusca(e.target.value)} 
          placeholder="Buscar por aluno ou número do pagamento..." 
          style={{ flex: '1 1 300px' }}
        />
        <select value={filtroSituacao} onChange={(e) => setFiltroSituacao(e.target.value as any)} style={{ flex: '0 1 200px' }}>
          <option value="todas">Todas as situações</option>
          <option value="Pendente">Pendente</option>
          <option value="Pago">Pago</option>
          <option value="Atrasado">Atrasado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '16px' }}>
        {pagamentosFiltrados.map((p) => (
          <CardPagamento 
            key={p.idBoleto} 
            pagamento={p} 
            aluno={alunos.find(a => a.idAluno === p.alunoIdAluno)}
            aoExcluir={() => aoExcluirPagamento(p.idBoleto)} 
          />
        ))}
      </div>
    </section>
  );
}

export default ListaPagamentos;