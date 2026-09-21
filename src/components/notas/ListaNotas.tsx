import { useMemo, useState } from "react";
import type { Nota, Matricula, Aluno, Avaliacao, GradeCurricular, Materia, Turma } from "../../types";
import CardNota from "./CardNota";
import "./ListaNotas.css";

interface ListaNotasProps {
  notas: Nota[];
  matriculas: Matricula[];
  alunos: Aluno[];
  avaliacoes: Avaliacao[];
  grades: GradeCurricular[];
  materias: Materia[];
  turmas: Turma[];
  aoNovaNota: () => void;
  aoEditarNota: (idNota: number) => void;
  aoExcluirNota: (idNota: number) => void;
}

type Ordenacao = "recentes" | "maior-nota" | "menor-nota";

function ListaNotas({
  notas,
  matriculas,
  alunos,
  avaliacoes,
  grades,
  materias,
  turmas,
  aoNovaNota,
  aoEditarNota,
  aoExcluirNota,
}: ListaNotasProps) {
  const [busca, setBusca] = useState("");
  const [filtroAvaliacao, setFiltroAvaliacao] = useState<"todas" | number>("todas");
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("recentes");

  const notasFiltradas = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();

    const filtradas = notas.filter((nota) => {
      const matricula = matriculas.find((item) => item.idMatricula === nota.matriculaIdMatricula);
      const aluno = matricula ? alunos.find((item) => item.idAluno === matricula.alunoIdAluno) : undefined;
      const avaliacao = avaliacoes.find((item) => item.idAvaliacao === nota.avaliacaoIdAvaliacao);
      const grade = avaliacao ? grades.find((item) => item.idGrade === avaliacao.gradeIdGrade) : undefined;
      const materia = grade ? materias.find((item) => item.idMateria === grade.materiaIdMateria) : undefined;

      const combinaBusca =
        buscaNormalizada === "" ||
        (aluno?.nomeAluno ?? "").toLowerCase().includes(buscaNormalizada) ||
        (avaliacao?.nomeAvaliacao ?? "").toLowerCase().includes(buscaNormalizada) ||
        (materia?.nomeMateria ?? "").toLowerCase().includes(buscaNormalizada);

      const combinaAvaliacao = filtroAvaliacao === "todas" || nota.avaliacaoIdAvaliacao === filtroAvaliacao;

      return combinaBusca && combinaAvaliacao;
    });

    const ordenadas = [...filtradas];
    if (ordenacao === "maior-nota") {
      ordenadas.sort((a, b) => b.valorNota - a.valorNota);
    } else if (ordenacao === "menor-nota") {
      ordenadas.sort((a, b) => a.valorNota - b.valorNota);
    } else {
      ordenadas.sort((a, b) => (b.criadoEm ?? "").localeCompare(a.criadoEm ?? ""));
    }

    return ordenadas;
  }, [notas, matriculas, alunos, avaliacoes, grades, materias, busca, filtroAvaliacao, ordenacao]);

  return (
    <section className="lista-notas">
      <header className="lista-notas__cabecalho">
        <h2>Lançamento de Notas</h2>
        <button type="button" className="lista-notas__botao-novo" onClick={aoNovaNota}>
          + Nova Nota
        </button>
      </header>

      <div className="lista-notas__filtros">
        <label className="lista-notas__busca">
          <IconeBusca />
          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar por aluno, avaliação ou matéria..."
            aria-label="Buscar notas"
          />
        </label>

        <select
          className="lista-notas__select"
          value={filtroAvaliacao}
          onChange={(evento) =>
            setFiltroAvaliacao(evento.target.value === "todas" ? "todas" : Number(evento.target.value))
          }
          aria-label="Filtrar por avaliação"
        >
          <option value="todas">Todas as avaliações</option>
          {avaliacoes.map((avaliacao) => (
            <option key={avaliacao.idAvaliacao} value={avaliacao.idAvaliacao}>
              {avaliacao.nomeAvaliacao}
            </option>
          ))}
        </select>

        <select
          className="lista-notas__select"
          value={ordenacao}
          onChange={(evento) => setOrdenacao(evento.target.value as Ordenacao)}
          aria-label="Ordenar notas"
        >
          <option value="recentes">Mais recentes</option>
          <option value="maior-nota">Maior nota</option>
          <option value="menor-nota">Menor nota</option>
        </select>
      </div>

      {notasFiltradas.length === 0 ? (
        <p className="lista-notas__vazio-geral">
          {notas.length === 0
            ? "Nenhuma nota lançada ainda."
            : "Nenhuma nota encontrada para esses filtros."}
        </p>
      ) : (
        <div className="lista-notas__grade">
          {notasFiltradas.map((nota) => (
            <CardNota
              key={nota.idNota}
              nota={nota}
              matriculas={matriculas}
              alunos={alunos}
              avaliacoes={avaliacoes}
              grades={grades}
              materias={materias}
              turmas={turmas}
              aoEditar={() => aoEditarNota(nota.idNota)}
              aoExcluir={() => aoExcluirNota(nota.idNota)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ListaNotas;

function IconeBusca() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false">
      <circle cx="9" cy="9" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <line
        x1="13.8"
        y1="13.8"
        x2="18.2"
        y2="18.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
