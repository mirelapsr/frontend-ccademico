import { useMemo, useState } from "react";
import type { Aluno, Escola, SituacaoAluno, Turma } from "../../types";
import { limparDigitos } from "../../utils/formatadores";
import CardAluno from "./CardAluno";
import "./ListaAlunos.css";

interface ListaAlunosProps {
  alunos: Aluno[];
  nomeTurmaPorAluno: Record<number, string | undefined>;
  escolas: Escola[];
  turmas: Turma[];
  /** idTurma da matrícula ativa de cada aluno (O(1) por idAluno). */
  turmaIdPorAluno: Record<number, number | undefined>;
  aoNovoAluno: () => void;
  aoEditarAluno: (idAluno: number) => void;
  aoExcluirAluno: (idAluno: number) => void;
  carregando?: boolean;
  erro?: string | null;
  aoRecarregar?: () => void;
}

type FiltroSituacao = "todas" | SituacaoAluno;

function ListaAlunos({
  alunos,
  nomeTurmaPorAluno,
  escolas,
  turmas,
  turmaIdPorAluno,
  aoNovoAluno,
  aoEditarAluno,
  aoExcluirAluno,
  carregando = false,
  erro = null,
  aoRecarregar,
}: ListaAlunosProps) {
  const [busca, setBusca] = useState("");
  const [filtroSituacao, setFiltroSituacao] = useState<FiltroSituacao>("todas");
  const [filtroTurma, setFiltroTurma] = useState("todas"); // "todas" | "sem-turma" | idTurma como texto
  const [filtroEscola, setFiltroEscola] = useState("todas"); // "todas" ou o idEscola como texto

  // Lookup O(1): turma da matrícula ativa → escola.
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
    const turmaAtual =
      filtroTurma === "todas" || filtroTurma === "sem-turma"
        ? undefined
        : mapaTurmas.get(Number(filtroTurma));
    if (turmaAtual && novaEscola !== "todas" && String(turmaAtual.escolaId) !== novaEscola) {
      setFiltroTurma("todas");
    }
  }

  const alunosFiltrados = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();
    const buscaNumerica = limparDigitos(busca);

    return alunos.filter((aluno) => {
      const combinaNome = aluno.nomeAluno.toLowerCase().includes(buscaNormalizada);
      const combinaMatricula = aluno.numeroMatricula.toLowerCase().includes(buscaNormalizada);
      const combinaCpf =
        buscaNumerica !== "" && (aluno.cpfAluno ?? "").includes(buscaNumerica);

      const combinaBusca =
        buscaNormalizada === "" || combinaNome || combinaMatricula || combinaCpf;

      const combinaFiltro = filtroSituacao === "todas" || aluno.situacao === filtroSituacao;

      const turmaDoAluno = turmaIdPorAluno[aluno.idAluno];
      const combinaTurma =
        filtroTurma === "todas" ||
        (filtroTurma === "sem-turma"
          ? turmaDoAluno === undefined
          : String(turmaDoAluno) === filtroTurma);

      const combinaEscola =
        filtroEscola === "todas" ||
        (turmaDoAluno !== undefined &&
          String(mapaTurmas.get(turmaDoAluno)?.escolaId) === filtroEscola);

      return combinaBusca && combinaFiltro && combinaTurma && combinaEscola;
    });
  }, [alunos, turmaIdPorAluno, mapaTurmas, busca, filtroSituacao, filtroTurma, filtroEscola]);

  return (
    <section className="lista-alunos">
      <header className="lista-alunos__cabecalho">
        <h2>Cadastro de Alunos</h2>
        <button type="button" className="lista-alunos__botao-novo" onClick={aoNovoAluno}>
          + Novo Aluno
        </button>
      </header>

      {erro && (
        <div className="lista-alunos__erro" role="alert">
          <p>{erro}</p>
          {aoRecarregar && (
            <button type="button" onClick={aoRecarregar} disabled={carregando}>
              Recarregar
            </button>
          )}
        </div>
      )}

      <div className="lista-alunos__filtros">
        <label className="lista-alunos__busca">
          <IconeBusca />
          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Buscar por nome, CPF ou matrícula..."
            aria-label="Buscar alunos"
          />
        </label>

        <select
          className="lista-alunos__select"
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
          className="lista-alunos__select"
          value={filtroTurma}
          onChange={(evento) => setFiltroTurma(evento.target.value)}
          aria-label="Filtrar por turma"
        >
          <option value="todas">Todas as turmas</option>
          <option value="sem-turma">Sem turma ativa</option>
          {turmasVisiveis.map((turma) => (
            <option key={turma.idTurma} value={turma.idTurma}>
              {turma.nomeTurma} ({turma.anoLetivo})
            </option>
          ))}
        </select>

        <select
          className="lista-alunos__select"
          value={filtroSituacao}
          onChange={(evento) => setFiltroSituacao(evento.target.value as FiltroSituacao)}
          aria-label="Filtrar por situação"
        >
          <option value="todas">Todas as situações</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
          <option value="Transferido">Transferido</option>
        </select>
      </div>

      {alunosFiltrados.length === 0 ? (
        <p className="lista-alunos__vazio-geral">
          {carregando
            ? "Carregando alunos..."
            : alunos.length === 0
              ? "Nenhum aluno cadastrado ainda."
              : "Nenhum aluno encontrado para esses filtros."}
        </p>
      ) : (
        <div className="lista-alunos__grade">
          {alunosFiltrados.map((aluno) => (
            <CardAluno
              key={aluno.idAluno}
              aluno={aluno}
              nomeTurma={nomeTurmaPorAluno[aluno.idAluno]}
              aoEditar={() => aoEditarAluno(aluno.idAluno)}
              aoExcluir={() => aoExcluirAluno(aluno.idAluno)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ListaAlunos;

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