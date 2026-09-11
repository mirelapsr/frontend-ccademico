import { useState } from "react";
import type { Aluno, Boleto, SituacaoBoleto } from "../../types";
import CardBoleto from "./CardBoleto";

interface ListaBoletosProps {
  boletos: Boleto[];
  alunos: Aluno[];
  aoNovoBoleto: () => void;
  aoExcluirBoleto: (idBoleto: number) => void;
}

function ListaBoletos({ boletos, alunos, aoNovoBoleto, aoExcluirBoleto }: ListaBoletosProps) {
  const [busca, setBusca] = useState("");
  const [filtroSituacao, setFiltroSituacao] = useState<"todas" | SituacaoBoleto>("todas");

  const boletosFiltrados = boletos.filter(b => {
    const aluno = alunos.find(a => a.idAluno === b.alunoIdAluno);
    const termo = busca.toLowerCase();
    const combinaBusca = b.numeroBoleto.toLowerCase().includes(termo) || aluno?.nomeAluno.toLowerCase().includes(termo);
    const combinaFiltro = filtroSituacao === "todas" || b.situacao === filtroSituacao;
    return combinaBusca && combinaFiltro;
  });

  return (
    <section>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2>Gestão de Boletos</h2>
        <button onClick={aoNovoBoleto}>+ Gerar Boleto</button>
      </header>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input 
          type="search" 
          value={busca} 
          onChange={(e) => setBusca(e.target.value)} 
          placeholder="Buscar por aluno ou número do boleto..." 
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {boletosFiltrados.map((b) => (
          <CardBoleto 
            key={b.idBoleto} 
            boleto={b} 
            aluno={alunos.find(a => a.idAluno === b.alunoIdAluno)}
            aoExcluir={() => aoExcluirBoleto(b.idBoleto)} 
          />
        ))}
      </div>
    </section>
  );
}

export default ListaBoletos;