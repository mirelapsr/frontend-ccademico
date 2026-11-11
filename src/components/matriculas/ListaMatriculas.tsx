import { useMemo, useState } from "react";
import type { Aluno, Escola, Matricula, SituacaoMatricula, Turma } from "../../types";
import CardMatricula from "./CardMatricula";
import "./ListaMatriculas.css";

interface ListaMatriculasProps {
  matriculas: Matricula[];
  alunos: Aluno[];
  escolas: Escola[];
  turmas: Turma[];
  aoNovaMatricula: () => void;
  aoEditarMatricula: (idMatricula: number) => void;
  aoExcluirMatricula: (idMatricula: number) => void;
}

type FiltroSituacao = "todas" | SituacaoMatricula;

function ListaMatriculas({
  matriculas,
  alunos,
  escolas,
  turmas,
  aoNovaMatricula,
  aoEditarMatricula,
  aoExcluirMatricula,
}: ListaMatriculasProps) {
  const [busca, setBusca] = useState("");
  const [filtroSituacao, setFiltroSituacao] = useState<FiltroSituacao>("todas");
  const [filtroTurma, setFiltroTurma] = useState("todas"); // "todas" ou o idTurma como texto
  const [filtroEscola, setFiltroEscola] = useState("todas"); // "todas" ou o idEscola como texto

  const mapaAlunos = useMemo(() => new Map(alunos.map((a) => [a.idAluno, a])), [alunos]);
  const mapaTurmas = useMemo(() => new Map(turmas.map((t) => [t.idTurma, t])), [turmas]);
  const turmasOrdenadas = useMemo(
    () =>
      [...turmas].sort(
        (a, b) => b.anoLetivo - a.anoLetivo || a.nomeTurma.localeCompare(b.nomeTurma, "pt-BR")
      ),
    [turmas]
  );

  const turmasVisiveis = useMemo(
    () =>
      filtroEscola === "todas"
        ? turmasOrdenadas
        : turmasOrdenadas.filter((turma) => String(turma.escolaId) === filtroEscola),
    [turmasOrdenadas, filtroEscola]
  );

  // Cascata: descarta a turma escolhida se ela não pertence à nova escola.
  function mudarEscola(novaEscola: string) {
    setFiltroEscola(novaEscola);
    const turmaAtual = filtroTurma === "todas" ? undefined : mapaTurmas.get(Number(filtroTurma));
    if (turmaAtual && novaEscola !== "todas" && String(turmaAtual.escolaId) !== novaEscola) {
      setFiltroTurma("todas");
    }
  }

  const matriculasFiltradas = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();

    return matriculas.filter((matricula) => {
      const aluno = mapaAlunos.get(matricula.alunoId);

      const combinaBusca =
        buscaNormalizada === "" ||
        (aluno?.nomeAluno ?? "").toLowerCase().includes(buscaNormalizada) ||
        (aluno?.numeroMatricula ?? "").toLowerCase().includes(buscaNormalizada);

      const combinaFiltro = filtroSituacao === "todas" || matricula.situacao === filtroSituacao;

      const combinaTurma = filtroTurma === "todas" || String(matricula.turmaId) === filtroTurma;

      const combinaEscola =
        filtroEscola === "todas" ||
        String(mapaTurmas.get(matricula.turmaId)?.escolaId) === filtroEscola;

      return combinaBusca && combinaFiltro && combinaTurma && combinaEscola;
    });
  }, [matriculas, mapaAlunos, mapaTurmas, busca, filtroSituacao, filtroTurma, filtroEscola]);

  return (
    <section className="lista-matriculas">
      <header className="lista-matriculas__cabecalho">
        <h2>Cadastro de Matrículas</h2>
        <button type="button" className="lista-matriculas__botao-novo" onClick={aoNovaMatricula}>
          + Nova Matrícula
        </button>
      </header>

      <div className="lista-matriculas__filtros">
        <label className="lista-matriculas__busca">
          <IconeBusca />
          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar por aluno ou nº de matrícula..."
            aria-label="Buscar matrículas por aluno"
          />
        </label>

        <select
          className="lista-matriculas__select"
          value={filtroEscola}
          onChange={(evento) => mudarEscola(evento.target.value)}
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
          className="lista-matriculas__select"
          value={filtroTurma}
          onChange={(evento) => setFiltroTurma(evento.target.value)}
          aria-label="Filtrar por turma"
        >
          <option value="todas">Todas as turmas</option>
          {turmasVisiveis.map((turma) => (
            <option key={turma.idTurma} value={turma.idTurma}>
              {turma.nomeTurma} ({turma.anoLetivo})
            </option>
          ))}
        </select>

        <select
          className="lista-matriculas__select"
          value={filtroSituacao}
          onChange={(evento) => setFiltroSituacao(evento.target.value as FiltroSituacao)}
          aria-label="Filtrar por situação"
        >
          <option value="todas">Todas as situações</option>
          <option value="Ativa">Ativa</option>
          <option value="Cancelada">Cancelada</option>
          <option value="Transferida">Transferida</option>
          <option value="Concluida">Concluída</option>
        </select>
      </div>

      {matriculasFiltradas.length === 0 ? (
        <p className="lista-matriculas__vazio-geral">
          {matriculas.length === 0
            ? "Nenhuma matrícula cadastrada ainda."
            : "Nenhuma matrícula encontrada para esses filtros."}
        </p>
      ) : (
        <div className="lista-matriculas__grade">
          {matriculasFiltradas.map((matricula) => (
            <CardMatricula
              key={matricula.idMatricula}
              matricula={matricula}
              alunos={alunos}
              turmas={turmas}
              aoEditar={() => aoEditarMatricula(matricula.idMatricula)}
              aoExcluir={() => aoExcluirMatricula(matricula.idMatricula)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ListaMatriculas;

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