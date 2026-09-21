import { useState, type FormEvent, useMemo } from "react";
import type { Aluno, Responsavel, AlunoResponsavelEntrada, TipoResponsavel } from "../../types";
import Combobox, { type OpcaoCombobox } from "../ui/Combobox";
interface FormularioVinculoProps {
  alunos: Aluno[];
  responsaveis: Responsavel[];
  salvar: (dados: AlunoResponsavelEntrada) => void;
  cancelar: () => void;
}

export default function FormularioVinculo({ alunos, responsaveis, salvar, cancelar }: FormularioVinculoProps) {
  const [alunoId, setAlunoId] = useState<number | string>(alunos[0]?.idAluno ?? "");
  const [respId, setRespId] = useState<number | string>(responsaveis[0]?.idResponsavel ?? "");
  const [tipo, setTipo] = useState<TipoResponsavel>("Mae");
  const [financeiro, setFinanceiro] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Mapeia alunos para o formato do Combobox
  const opcoesAlunos: OpcaoCombobox[] = useMemo(() => {
    return alunos.map((a) => ({
      valor: a.idAluno,
      rotulo: a.nomeAluno,
      subrotulo: `Matrícula: ${a.numeroMatricula}`,
    }));
  }, [alunos]);

  // Mapeia responsáveis para o formato do Combobox
  const opcoesResponsaveis: OpcaoCombobox[] = useMemo(() => {
    return responsaveis.map((r) => ({
      valor: r.idResponsavel,
      rotulo: r.nomeResp,
      subrotulo: r.cpfResp ? `CPF: ${r.cpfResp}` : "CPF não informado",
    }));
  }, [responsaveis]);

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
      responsavelFinanceiro: financeiro,
    });
  }

  return (
    <section style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Novo Vínculo</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
        
        {/* Combobox de Aluno */}
        <Combobox
          opcoes={opcoesAlunos}
          valorSelecionado={alunoId}
          onSelecionar={(val) => setAlunoId(val)}
          placeholder="Digite o nome ou matrícula do aluno..."
          rotulo="Aluno"
          obrigatorio={true}
        />

        {/* Combobox de Responsável */}
        <Combobox
          opcoes={opcoesResponsaveis}
          valorSelecionado={respId}
          onSelecionar={(val) => setRespId(val)}
          placeholder="Digite o nome ou CPF do responsável..."
          rotulo="Responsável"
          obrigatorio={true}
        />

        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>Grau de Parentesco *</span>
          <select 
            value={tipo} 
            onChange={(e) => setTipo(e.target.value as TipoResponsavel)}
            style={{ padding: '8px 12pux', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="Mae">Mãe</option>
            <option value="Pai">Pai</option>
            <option value="ResponsavelLegal">Responsável Legal</option>
            <option value="Outro">Outro</option>
          </select>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '10px' }}>
          <input 
            type="checkbox" 
            checked={financeiro} 
            onChange={(e) => setFinanceiro(e.target.checked)} 
            style={{ width: '18px', height: '18px' }} 
          />
          <strong>Responsável Financeiro?</strong>
        </label>

        {erro && <p style={{ color: 'red', fontSize: '0.85rem' }}>{erro}</p>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <button type="button" onClick={cancelar} style={{ background: 'transparent', color: '#666', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '6px' }}>Cancelar</button>
          <button type="submit" style={{ background: '#1e3a8a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Vincular</button>
        </div>
      </form>
    </section>
  );
}