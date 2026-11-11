import { useMemo, useState } from "react";
import type { Aluno, Escola, Matricula, Responsavel, AlunoResponsavel, Turma } from "../../types";
import { mapearEscolaPorAluno } from "../../utils/escolaPorAluno";
import CardVinculo from "./CardVinculo";
import "./ListaVinculos.css";

interface ListaVinculosProps {
  vinculos: AlunoResponsavel[];
  alunos: Aluno[];
  responsaveis: Responsavel[];
  escolas: Escola[];
  /** Matrículas + turmas resolvem a escola do aluno do vínculo. */
  matriculas: Matricula[];
  turmas: Turma[];
  aoNovoVinculo: () => void;
  aoExcluirVinculo: (idAluno: number, idResp: number) => void;
}

function ListaVinculos({
  vinculos,
  alunos,
  responsaveis,
  escolas,
  matriculas,
  turmas,
  aoNovoVinculo,
  aoExcluirVinculo,
}: ListaVinculosProps) {
  const [busca, setBusca] = useState("");
  const [filtroEscola, setFiltroEscola] = useState("todas"); // "todas" ou o idEscola como texto

  // Lookup O(1): idAluno → idEscola (via matrícula ativa).
  const escolaPorAluno = useMemo(
    () => mapearEscolaPorAluno(matriculas, turmas),
    [matriculas, turmas]
  );

  const vinculosFiltrados = vinculos.filter((v) => {
    const aluno = alunos.find((a) => a.idAluno === v.alunoId);
    const resp = responsaveis.find((r) => r.idResponsavel === v.responsavelId);
    const termo = busca.toLowerCase();
    const combinaEscola =
      filtroEscola === "todas" || String(escolaPorAluno.get(v.alunoId)) === filtroEscola;
    return (
      combinaEscola &&
      ((aluno?.nomeAluno.toLowerCase().includes(termo) ?? false) ||
        (resp?.nomeResp.toLowerCase().includes(termo) ?? false))
    );
  });

  return (
    <section>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
        <h2>Cadastro de Vínculos</h2>
        <button onClick={aoNovoVinculo}>+ Novo Vínculo</button>
      </header>
      <div className="lista-vinculos__filtros">
        <input
          type="search"
          className="lista-vinculos__busca"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por aluno ou responsável..."
        />
        <select
          className="lista-vinculos__select"
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
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "16px" }}>
        {vinculosFiltrados.length === 0 ? (
          <p style={{ textAlign: "center", color: "#64748b", fontStyle: "italic", padding: "24px" }}>
            {vinculos.length === 0 ? "Nenhum vínculo cadastrado." : "Nenhum vínculo encontrado para esta pesquisa."}
          </p>
        ) : (
          vinculosFiltrados.map((v) => (
            <CardVinculo 
              key={`${v.alunoId}-${v.responsavelId}`} 
              vinculo={v} 
              aluno={alunos.find((a) => a.idAluno === v.alunoId)}
              responsavel={responsaveis.find((r) => r.idResponsavel === v.responsavelId)}
              aoExcluir={() => aoExcluirVinculo(v.alunoId, v.responsavelId)} 
            />
          ))
        )}
      </div>
    </section>
  );
}

export default ListaVinculos;