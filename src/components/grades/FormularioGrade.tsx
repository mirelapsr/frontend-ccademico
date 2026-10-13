import { useEffect, useRef, useState, type FormEvent } from "react";
import type { GradeCurricular, GradeCurricularEntrada, Turma, Materia, Professor } from "../../types";
import "./FormularioGrade.css";

interface FormularioGradeProps {
  gradeEditando?: GradeCurricular | null;
  turmas: Turma[];
  materias: Materia[];
  professores: Professor[];
  existeGradeDuplicada: (turmaId: number, materiaId: number) => boolean;
  salvar: (dados: GradeCurricularEntrada) => Promise<void>;
  cancelar: () => void;
}

function anoAtual(): number {
  return new Date().getFullYear();
}

function extrairId(objeto: any, chaves: string[], fallback: number): number {
  if (!objeto) return fallback;
  for (const chave of chaves) {
    const val = objeto[chave];
    if (val !== undefined && val !== null && Number(val) > 0) {
      return Number(val);
    }
  }
  return fallback;
}

function FormularioGrade({
  gradeEditando,
  turmas,
  materias,
  professores,
  existeGradeDuplicada,
  salvar,
  cancelar,
}: FormularioGradeProps) {
  const g = gradeEditando as Record<string, any> | undefined;

  const [turmaId, setTurmaId] = useState<number>(gradeEditando?.turmaId ?? turmas[0]?.idTurma ?? 0);
  const [materiaId, setMateriaId] = useState<number>(gradeEditando?.materiaId ?? materias[0]?.idMateria ?? 0);
  const [professorId, setProfessorId] = useState<number>(
    gradeEditando?.professorId ?? professores[0]?.idProfessor ?? 0
  );
  const [cargaHorariaSemanal, setCargaHorariaSemanal] = useState<string>(
    gradeEditando?.cargaHorariaSemanal?.toString() ?? ""
  );

  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const emEnvioRef = useRef(false);

  useEffect(() => {
    setTurmaId(gradeEditando?.turmaId ?? turmas[0]?.idTurma ?? 0);
    setMateriaId(gradeEditando?.materiaId ?? materias[0]?.idMateria ?? 0);
    setProfessorId(gradeEditando?.professorId ?? professores[0]?.idProfessor ?? 0);
    setCargaHorariaSemanal(gradeEditando?.cargaHorariaSemanal?.toString() ?? "");
    setErro(null);
  }, [gradeEditando, turmas, materias, professores]);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (emEnvioRef.current) return;

    const tId = Number(turmaId);
    const mId = Number(materiaId);
    const pId = Number(professorId);

    if (!turmaId || !materiaId || !professorId) {
      setErro("Turma, matéria e professor são obrigatórios.");
      return;
    }

    if (existeGradeDuplicada(turmaId, materiaId)) {
      const turma = turmas.find((item) => item.idTurma === turmaId);
      const materia = materias.find((item) => item.idMateria === materiaId);
      setErro(
        `A turma "${turma?.nomeTurma ?? "selecionada"}" já tem "${
          materia?.nomeMateria ?? "essa matéria"
        }" cadastrada na grade curricular.`
      );
      return;
    }

    emEnvioRef.current = true;
    setEnviando(true);
    setErro(null);

    try {
      await salvar({
        turmaId,
        materiaId,
        professorId,
        cargaHorariaSemanal: cargaHorariaSemanal ? Number(cargaHorariaSemanal) : null,
      });
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar a grade curricular.");
    } finally {
      emEnvioRef.current = false;
      setEnviando(false);
    }
  }

  return (
    <section className="formulario-grade">
      <header className="formulario-grade__cabecalho">
        <h2>{gradeEditando ? "Editar Grade Curricular" : "Nova Grade Curricular"}</h2>
      </header>

      <form className="formulario-grade__form" onSubmit={handleSubmit} noValidate>
        <label className="formulario-grade__campo formulario-grade__campo--largo">
          <span>Turma *</span>
          <select
            value={turmaId}
            onChange={(evento) => {
              setTurmaId(Number(evento.target.value));
              setErro(null);
            }}
            disabled={enviando}
          >
            {turmas.length === 0 && <option value={0}>Nenhuma turma cadastrada</option>}
            {turmas.map((turma) => (
              <option key={turma.idTurma} value={turma.idTurma}>
                {turma.nomeTurma} ({turma.anoLetivo})
              </option>
            ))}
          </select>
        </label>

        <label className="formulario-grade__campo formulario-grade__campo--largo">
          <span>Matéria *</span>
          <select
            value={materiaId}
            onChange={(evento) => {
              setMateriaId(Number(evento.target.value));
              setErro(null);
            }}
            disabled={enviando}
          >
            {materias.length === 0 && <option value={0}>Nenhuma matéria cadastrada</option>}
            {materias.map((materia) => (
              <option key={materia.idMateria} value={materia.idMateria}>
                {materia.nomeMateria}
              </option>
            ))}
          </select>
        </label>

        <label className="formulario-grade__campo formulario-grade__campo--largo">
          <span>Professor *</span>
          <select
            value={professorId}
            onChange={(evento) => {
              setProfessorId(Number(evento.target.value));
              setErro(null);
            }}
            disabled={enviando}
          >
            {professores.length === 0 && <option value={0}>Nenhum professor cadastrado</option>}
            {professores.map((professor) => (
              <option key={professor.idProfessor} value={professor.idProfessor}>
                {professor.nomeProf}
              </option>
            ))}
          </select>
        </label>

        <label className="formulario-grade__campo">
          <span>Carga horária semanal (h)</span>
          <input
            type="number"
            value={cargaHorariaSemanal}
            onChange={(evento) => {
              setCargaHorariaSemanal(evento.target.value);
              setErro(null);
            }}
            min={0}
            placeholder="Opcional"
            disabled={enviando}
          />
        </label>

        {erro && (
          <p className="formulario-grade__erro" role="alert">
            {erro}
          </p>
        )}

        <div className="formulario-grade__acoes">
          <button
            type="button"
            className="formulario-grade__botao-cancelar"
            onClick={cancelar}
            disabled={enviando}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="formulario-grade__botao-salvar"
            disabled={enviando}
          >
            {enviando
              ? "Salvando..."
              : gradeEditando
                ? "Salvar alterações"
                : "Cadastrar grade"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioGrade;