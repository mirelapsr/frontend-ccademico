import { useRef, useState, type FormEvent } from "react";
import type { Aluno, BoletoEntrada } from "../../types";

interface FormularioPagamentoProps {
  alunos: Aluno[];
  salvar: (dados: BoletoEntrada) => Promise<void> | void;
  cancelar: () => void;
}

const REGEX_COMPETENCIA = /^\d{4}-(0[1-9]|1[0-2])$/;

function FormularioPagamento({ alunos, salvar, cancelar }: FormularioPagamentoProps) {
  const [numeroPagamento, setNumeroPagamento] = useState("");
  const [alunoId, setAlunoId] = useState(alunos[0]?.idAluno ?? 0);
  const [competencia, setCompetencia] = useState("");
  const [valor, setValor] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const emEnvioRef = useRef(false);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (emEnvioRef.current || enviando) return;

    if (!numeroPagamento.trim() || !alunoId || !competencia || !valor || !vencimento) {
      setErro("Todos os campos são obrigatórios.");
      return;
    }

    if (!REGEX_COMPETENCIA.test(competencia.trim())) {
      setErro("Competência inválida. Selecione um mês no formato AAAA-MM.");
      return;
    }

    const valorNumerico = Number(valor.toString().replace(",", "."));
    if (Number.isNaN(valorNumerico) || valorNumerico <= 0) {
      setErro("Informe um valor monetário válido.");
      return;
    }

    emEnvioRef.current = true;
    setEnviando(true);
    setErro(null);

    try {
      await salvar({
        numeroBoleto: numeroPagamento.trim(),
        alunoId: Number(alunoId),
        competencia: competencia.trim(),
        valorMensalidade: valorNumerico,
        dataVencimento: vencimento,
        situacao: "Pendente",
      } as unknown as BoletoEntrada);
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao cadastrar cobrança.");
    } finally {
      emEnvioRef.current = false;
      setEnviando(false);
    }
  }

  return (
    <section style={{ background: "#fff", padding: "24px", borderRadius: "8px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Novo Pagamento / Boleto</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: "6px", gridColumn: "1 / -1" }}>
          <span>Aluno *</span>
          <select
            value={alunoId}
            onChange={(e) => {
              setAlunoId(Number(e.target.value));
              setErro(null);
            }}
            disabled={enviando}
          >
            {alunos.length === 0 && <option value={0}>Nenhum aluno cadastrado</option>}
            {alunos.map((a) => (
              <option key={a.idAluno} value={a.idAluno}>
                {a.nomeAluno}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span>Número do Pagamento *</span>
          <input
            value={numeroPagamento}
            onChange={(e) => {
              setNumeroPagamento(e.target.value);
              setErro(null);
            }}
            placeholder="Ex: BOL-2026-0015"
            disabled={enviando}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span>Competência (YYYY-MM) *</span>
          <input
            type="month"
            value={competencia}
            onChange={(e) => {
              setCompetencia(e.target.value);
              setErro(null);
            }}
            disabled={enviando}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span>Valor (R$) *</span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={valor}
            onChange={(e) => {
              setValor(e.target.value);
              setErro(null);
            }}
            placeholder="0.00"
            disabled={enviando}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span>Vencimento *</span>
          <input
            type="date"
            value={vencimento}
            onChange={(e) => {
              setVencimento(e.target.value);
              setErro(null);
            }}
            disabled={enviando}
          />
        </label>

        {erro && <p style={{ color: "red", gridColumn: "1 / -1" }}>{erro}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", gridColumn: "1 / -1", marginTop: "16px" }}>
          <button type="button" onClick={cancelar} disabled={enviando} style={{ background: "transparent", color: "#666", border: "1px solid #ccc" }}>
            Cancelar
          </button>
          <button type="submit" disabled={enviando}>
            {enviando ? "Cadastrando..." : "Cadastrar Cobrança"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioPagamento;