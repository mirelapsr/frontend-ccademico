import { useState } from "react";
import type { Aluno, Responsavel, AlunoResponsavel } from "../../types";
import CardVinculo from "./CardVinculo";

interface ListaVinculosProps {
  vinculos: AlunoResponsavel[];
  alunos: Aluno[];
  responsaveis: Responsavel[];
  aoNovoVinculo: () => void;
  aoExcluirVinculo: (idAluno: number, idResp: number) => void;
}

function ListaVinculos({ vinculos, alunos, responsaveis, aoNovoVinculo, aoExcluirVinculo }: ListaVinculosProps) {
  const [busca, setBusca] = useState("");

  const vinculosFiltrados = vinculos.filter(v => {
    const aluno = alunos.find(a => a.idAluno === v.alunoIdAluno);
    const resp = responsaveis.find(r => r.idResponsavel === v.responsavelIdResponsavel);
    const termo = busca.toLowerCase();
    return (aluno?.nomeAluno.toLowerCase().includes(termo) || resp?.nomeResp.toLowerCase().includes(termo));
  });

  return (
    <section>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2>Cadastro de Vínculos</h2>
        <button onClick={aoNovoVinculo}>+ Novo Vínculo</button>
      </header>
      <div style={{ marginBottom: '24px' }}>
        <input 
          type="search" 
          value={busca} 
          onChange={(e) => setBusca(e.target.value)} 
          placeholder="Buscar por aluno ou responsável..." 
          style={{ width: '100%', maxWidth: '400px' }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '16px' }}>
        {vinculosFiltrados.map((v) => (
          <CardVinculo 
            key={`${v.alunoIdAluno}-${v.responsavelIdResponsavel}`} 
            vinculo={v} 
            aluno={alunos.find(a => a.idAluno === v.alunoIdAluno)}
            responsavel={responsaveis.find(r => r.idResponsavel === v.responsavelIdResponsavel)}
            aoExcluir={() => aoExcluirVinculo(v.alunoIdAluno, v.responsavelIdResponsavel)} 
          />
        ))}
      </div>
    </section>
  );
}

export default ListaVinculos;