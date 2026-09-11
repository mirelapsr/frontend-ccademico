import { useState, type FormEvent } from "react";
import type { Aluno, Responsavel, AlunoResponsavelEntrada, TipoResponsavel } from "../../types";

interface FormularioVinculoProps {
  alunos: Aluno[];
  responsaveis: Responsavel[];
  salvar: (dados: AlunoResponsavelEntrada) => void;
  cancelar: () => void;
}

function FormularioVinculo({ alunos, responsaveis, salvar, cancelar }: FormularioVinculoProps) {
  const [alunoId, setAlunoId] = useState(alunos[0]?.idAluno ?? 0);
  const [respId, setRespId] = useState(responsaveis[0]?.idResponsavel ?? 0);
  const [tipo, setTipo] = useState<TipoResponsavel>("Mae");
  const [financeiro, setFinanceiro] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!alunoId || !respId) {
      setErro("Aluno e Responsável são obrigatórios.");
      return;
    }
    setErro(null);
    salvar({
      alunoIdAluno: Number(alunoId),
      responsavelIdResponsavel: Number(respId),
      tipoResponsavel: tipo,
      responsavelFinanceiro: financeiro
    });
  }

  return (
    <section style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Novo Vínculo</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span>Aluno *</span>
          <select value={alunoId} onChange={(e) => setAlunoId(Number(e.target.value))}>
            {alunos.map(a => <option key={a.idAluno} value={a.idAluno}>{a.nomeAluno}</option>)}
          </select>
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span>Responsável *</span>
          <select value={respId} onChange={(e) => setRespId(Number(e.target.value))}>
            {responsaveis.map(r => <option key={r.idResponsavel} value={r.idResponsavel}>{r.nomeResp}</option>)}
          </select>
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span>Grau de Parentesco *</span>
          <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoResponsavel)}>
            <option value="Mae">Mãe</option>
            <option value="Pai">Pai</option>
            <option value="ResponsavelLegal">Responsável Legal</option>
            <option value="Outro">Outro</option>
          </select>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '10px' }}>
          <input type="checkbox" checked={financeiro} onChange={(e) => setFinanceiro(e.target.checked)} style={{ width: '18px', height: '18px' }} />
          <strong>Responsável Financeiro?</strong>
        </label>
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <button type="button" onClick={cancelar} style={{ background: 'transparent', color: '#666', border: '1px solid #ccc' }}>Cancelar</button>
          <button type="submit">Vincular</button>
        </div>
      </form>
    </section>
  );
}

export default FormularioVinculo;