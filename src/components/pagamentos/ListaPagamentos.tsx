import { useMemo, useState } from "react";
import type { Aluno, Boleto, Escola, Matricula, SituacaoBoleto, Turma } from "../../types";
import { mapearEscolaPorAluno } from "../../utils/escolaPorAluno";
import CardPagamento from "./CardPagamento";
import "./ListaPagamentos.css";

interface ListaPagamentosProps {
  pagamentos: Boleto[];
  alunos: Aluno[];
  escolas: Escola[];
  /** Matrículas + turmas resolvem a escola do aluno (boleto não tem FK de escola). */
  matriculas: Matricula[];
  turmas: Turma[];
  aoNovoPagamento: () => void;
  aoDarBaixaPagamento: (idBoleto: number) => void;
  aoExcluirPagamento: (idBoleto: number) => void;
}

function ListaPagamentos({
  pagamentos,
  alunos,
  escolas,
  matriculas,
  turmas,
  aoNovoPagamento,
  aoDarBaixaPagamento,
  aoExcluirPagamento,
}: ListaPagamentosProps) {
  const [busca, setBusca] = useState("");
  const [filtroSituacao, setFiltroSituacao] = useState<"todas" | SituacaoBoleto>("todas");
  const [filtroEscola, setFiltroEscola] = useState("todas"); // "todas" ou o idEscola como texto

  // Lookup O(1): idAluno → idEscola (via matrícula ativa).
  const escolaPorAluno = useMemo(
    () => mapearEscolaPorAluno(matriculas, turmas),
    [matriculas, turmas]
  );

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
      const combinaEscola =
        filtroEscola === "todas" ||
        (idAlunoBoleto !== undefined && String(escolaPorAluno.get(idAlunoBoleto)) === filtroEscola);
      return combinaBusca && combinaFiltro && combinaEscola;
    });
  }, [pagamentos, alunos, escolaPorAluno, busca, filtroSituacao, filtroEscola]);

  return (
    <section>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
        <h2>Controle de Pagamentos</h2>
        <button onClick={aoNovoPagamento}>+ Novo Pagamento</button>
      </header>
      <div className="lista-pagamentos__filtros">
        <input
          type="search"
          className="lista-pagamentos__busca"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por aluno ou número do pagamento..."
        />
        <select
          className="lista-pagamentos__select"
          value={filtroEscola}
          onChange={(e) => setFiltroEscola(e.target.value)}
          aria-label="Filtrar por escola"
        >
          <option value="todas">Todas as escolas</option>
          {escolas.map((escola) => (
            <option key={escola.idEscola} value={escola.idEscola}>
              {escola.nomeEscola}
            </option>
          ))}
        </select>
        <select
          className="lista-pagamentos__select"
          value={filtroSituacao}
          onChange={(e) => setFiltroSituacao(e.target.value as "todas" | SituacaoBoleto)}
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