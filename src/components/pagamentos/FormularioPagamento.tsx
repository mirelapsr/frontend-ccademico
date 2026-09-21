import { useState, type FormEvent } from "react";
import type { Aluno, BoletoEntrada, SituacaoBoleto } from "../../types";

interface FormularioPagamentoProps {
  alunos: Aluno[];
  salvar: (dados: BoletoEntrada) => void;
  cancelar: () => void;
}

function FormularioPagamento({ alunos, salvar, cancelar }: FormularioPagamentoProps) {
  const [numeroPagamento, setNumeroPagamento] = useState("");
  const [alunoId, setAlunoId] = useState(alunos[0]?.idAluno ?? 0);
  const [competencia, setCompetencia] = useState("");
  const [valor, setValor] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [situacao, setSituacao] = useState<SituacaoBoleto>("Pendente");
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!numeroPagamento || !alunoId || !competencia || !valor || !vencimento) {
      setErro("Todos os campos obrigatórios devem ser preenchidos.");
      return;
    }
    setErro(null);
    salvar({
      numeroBoleto: numeroPagamento,
      alunoIdAluno: Number(alunoId),
      competencia,
      valorMensalidade: Number(valor),
      dataVencimento: vencimento,
      dataPagamento: situacao === "Pago" ? new Date().toISOString().slice(0, 10) : null,
      situacao
    });
  }

  return (
    <section style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Novo Pagamento</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
          <span>Aluno *</span>
          <select value={alunoId} onChange={(e) => setAlunoId(Number(e.target.value))}>
            {alunos.map(a => <option key={a.idAluno} value={a.idAluno}>{a.nomeAluno}</option>)}
          </select>
        </label>
        
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span>Número do Pagamento *</span>
          <input value={numeroPagamento} onChange={(e) => setNumeroPagamento(e.target.value)} placeholder="Ex: BOL-2026-0015" />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span>Competência (YYYY-MM) *</span>
          <input type="month" value={competencia} onChange={(e) => setCompetencia(e.target.value)} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span>Valor (R$) *</span>
          <input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0.00" />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span>Vencimento *</span>
          <input type="date" value={vencimento} onChange={(e) => setVencimento(e.target.value)} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
          <span>Situação do Pagamento *</span>
          <select value={situacao} onChange={(e) => setSituacao(e.target.value as SituacaoBoleto)}>
            <option value="Pendente">Pendente</option>
            <option value="Pago">Pago</option>
            <option value="Atrasado">Atrasado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </label>

        {erro && <p style={{ color: 'red', gridColumn: '1 / -1' }}>{erro}</p>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', gridColumn: '1 / -1', marginTop: '16px' }}>
          <button type="button" onClick={cancelar} style={{ background: 'transparent', color: '#666', border: '1px solid #ccc' }}>Cancelar</button>
          <button type="submit">Salvar Pagamento</button>
        </div>
      </form>
    </section>
  );
}

export default FormularioPagamento;