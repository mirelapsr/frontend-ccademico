import { useMemo, useState } from "react";
import type { Aluno, Boleto, SituacaoBoleto } from "../../types";
import CardPagamento from "./CardPagamento";

interface ListaPagamentosProps {
  pagamentos: Boleto[];
  alunos: Aluno[];
  aoNovoPagamento: () => void;
  aoDarBaixaPagamento: (idBoleto: number) => void;
  aoExcluirPagamento: (idBoleto: number) => void;
}

function ListaPagamentos({
  pagamentos,
  alunos,
  aoNovoPagamento,
  aoDarBaixaPagamento,
  aoExcluirPagamento,
}: ListaPagamentosProps) {
  const [busca, setBusca] = useState("");
  const [filtroSituacao, setFiltroSituacao] = useState<"todas" | SituacaoBoleto>("todas");

  const pagamentosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return pagamentos.filter((p) => {
      const idAlunoBoleto = (p as unknown as { alunoId?: number }).alunoId ?? (p as unknown as { alunoIdAluno?: number }).alunoIdAluno;
      const aluno = alunos.find((a) => a.idAluno === idAlunoBoleto);

      const combinaBusca =
        termo === "" ||
        p.numeroBoleto.toLowerCase().includes(termo) ||
        (aluno?.nomeAluno ?? "").toLowerCase().includes(termo);

      const combinaFiltro = filtroSituacao === "todas" || p.situacao === filtroSituacao;
      return combinaBusca && combinaFiltro;
    });
  }, [pagamentos, alunos, busca, filtroSituacao]);

  return (
    <section>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
        <h2>Controle de Pagamentos</h2>
        <button onClick={aoNovoPagamento}>+ Novo Pagamento</button>
      </header>
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por aluno ou número do pagamento..."
          style={{ flex: "1 1 300px" }}
        />
        <select
          value={filtroSituacao}
          onChange={(e) => setFiltroSituacao(e.target.value as "todas" | SituacaoBoleto)}
          style={{ flex: "0 1 200px" }}
        >
          <option value="todas">Todas as situações</option>
          <option value="Pendente">Pendente</option>
          <option value="Pago">Pago</option>
          <option value="Atrasado">Atrasado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "16px" }}>
        {pagamentosFiltrados.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", padding: "24px" }}>
            Nenhum pagamento encontrado.
          </p>
        ) : (
          pagamentosFiltrados.map((p) => {
            const idAlunoBoleto = (p as unknown as { alunoId?: number }).alunoId ?? (p as unknown as { alunoIdAluno?: number }).alunoIdAluno;
            return (
              <CardPagamento
                key={p.idBoleto}
                pagamento={p}
                aluno={alunos.find((a) => a.idAluno === idAlunoBoleto)}
                aoDarBaixa={() => aoDarBaixaPagamento(p.idBoleto)}
                aoExcluir={() => aoExcluirPagamento(p.idBoleto)}
              />
            );
          })
        )}
      </div>
    </section>
  );
}

export default ListaPagamentos;