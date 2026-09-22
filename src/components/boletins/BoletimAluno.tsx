import { useMemo, useState } from "react";
import type { Aluno, Avaliacao, Frequencia, GradeCurricular, Materia, Matricula, Nota, Periodo, Turma } from "../../types";
import ModalConfirmacao from "../ui/ModalConfirmacao";
import {
  acharNota,
  arredondar2,
  calcularMediaPonderada,
  contarFaltas,
  formatarMedia,
  ordenarAvaliacoes,
  ROTULO_SITUACAO,
  situacaoPelaMedia,
} from "../../utils/boletim";
import "./BoletimAluno.css";

/** `valor: null` significa "campo limpo" — a nota gravada deve ser removida. */
export interface AlteracaoNota {
  avaliacaoId: number;
  valor: number | null;
}

interface BoletimAlunoProps {
  aluno: Aluno;
  matricula: Matricula;
  turma: Turma;
  periodo: Periodo;
  grades: GradeCurricular[];
  materias: Materia[];
  avaliacoes: Avaliacao[];
  notas: Nota[];
  frequencias: Frequencia[];
  aoVoltar: () => void;
  aoSalvar: (alteracoes: AlteracaoNota[]) => void;
  aoNotificar: (mensagem: string, tipo: "sucesso" | "erro") => void;
}

interface Leitura {
  valor: number | null;
  invalido: boolean;
}

function lerCampo(texto: string): Leitura {
  if (texto.trim() === "") return { valor: null, invalido: false };
  const numero = Number(texto.replace(",", "."));
  if (Number.isNaN(numero) || numero < 0 || numero > 10) return { valor: null, invalido: true };
  return { valor: arredondar2(numero), invalido: false };
}

function BoletimAluno({
  aluno,
  matricula,
  turma,
  periodo,
  grades,
  materias,
  avaliacoes,
  notas,
  frequencias,
  aoVoltar,
  aoSalvar,
  aoNotificar,
}: BoletimAlunoProps) {
  // Uma linha por disciplina da grade da turma, já com as avaliações do período.
  const linhas = useMemo(
    () =>
      grades
        .filter((grade) => grade.turmaIdTurma === turma.idTurma)
        .map((grade) => ({
          grade,
          nomeMateria:
            materias.find((materia) => materia.idMateria === grade.materiaIdMateria)?.nomeMateria ??
            "Matéria não encontrada",
          avaliacoes: ordenarAvaliacoes(
            avaliacoes.filter(
              (avaliacao) =>
                avaliacao.gradeIdGrade === grade.idGrade && avaliacao.periodoIdPeriodo === periodo.idPeriodo
            )
          ),
          faltas: contarFaltas(frequencias, matricula.idMatricula, new Set([grade.idGrade]), periodo),
        }))
        .sort((a, b) => a.nomeMateria.localeCompare(b.nomeMateria, "pt-BR")),
    [grades, materias, avaliacoes, frequencias, turma.idTurma, periodo, matricula.idMatricula]
  );

  // Rascunho em texto (permite campo vazio/digitação parcial), indexado por avaliação.
  const [rascunho, setRascunho] = useState<Record<number, string>>(() => {
    const inicial: Record<number, string> = {};
    for (const linha of linhas) {
      for (const avaliacao of linha.avaliacoes) {
        const nota = acharNota(notas, matricula.idMatricula, avaliacao.idAvaliacao);
        inicial[avaliacao.idAvaliacao] = nota ? String(nota.valorNota) : "";
      }
    }
    return inicial;
  });
  const [confirmandoSaida, setConfirmandoSaida] = useState(false);

  const todasAvaliacoes = linhas.flatMap((linha) => linha.avaliacoes);

  const alteracoes: AlteracaoNota[] = [];
  let temCampoInvalido = false;
  for (const avaliacao of todasAvaliacoes) {
    const leitura = lerCampo(rascunho[avaliacao.idAvaliacao] ?? "");
    if (leitura.invalido) {
      temCampoInvalido = true;
      continue;
    }
    const gravada = acharNota(notas, matricula.idMatricula, avaliacao.idAvaliacao)?.valorNota ?? null;
    if (leitura.valor !== gravada) {
      alteracoes.push({ avaliacaoId: avaliacao.idAvaliacao, valor: leitura.valor });
    }
  }
  const temPendencias = alteracoes.length > 0 || temCampoInvalido;
  const totalFaltas = linhas.reduce((soma, linha) => soma + linha.faltas, 0);

  function salvar() {
    if (temCampoInvalido) {
      aoNotificar("Corrija as notas fora do intervalo de 0 a 10 antes de salvar.", "erro");
      return;
    }
    if (alteracoes.length === 0) {
      aoNotificar("Nenhuma alteração para salvar.", "sucesso");
      return;
    }
    aoSalvar(alteracoes);
  }

  function voltar() {
    if (temPendencias) setConfirmandoSaida(true);
    else aoVoltar();
  }

  return (
    <section className="boletim-aluno">
      <button type="button" className="boletim-aluno__voltar" onClick={voltar}>
        ← Voltar para Turma
      </button>

      <header className="boletim-aluno__cabecalho">
        <div>
          <h2>{aluno.nomeAluno}</h2>
          <p>
            Matrícula {aluno.numeroMatricula} · {turma.nomeTurma} · {periodo.nomePeriodo} ({periodo.ano})
          </p>
        </div>
        <p className="boletim-aluno__resumo-faltas">
          <strong>{totalFaltas}</strong> {totalFaltas === 1 ? "falta" : "faltas"} no período
        </p>
      </header>

      {linhas.length === 0 ? (
        <p className="boletim-aluno__vazio">Esta turma ainda não tem disciplinas na grade curricular.</p>
      ) : (
        <div className="boletim-aluno__tabela-envoltorio">
          <table className="boletim-aluno__tabela">
            <thead>
              <tr>
                <th scope="col">Disciplina</th>
                <th scope="col">Avaliações</th>
                <th scope="col">Média Final</th>
                <th scope="col">Total de Faltas</th>
                <th scope="col">Situação</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map(({ grade, nomeMateria, avaliacoes: avaliacoesDaLinha, faltas }) => {
                const media = calcularMediaPonderada(
                  avaliacoesDaLinha.map((avaliacao) => ({
                    valor: lerCampo(rascunho[avaliacao.idAvaliacao] ?? "").valor,
                    peso: avaliacao.peso,
                  }))
                );
                const nivel = situacaoPelaMedia(media);

                return (
                  <tr key={grade.idGrade}>
                    <th scope="row" data-rotulo="Disciplina" className="boletim-aluno__materia">
                      {nomeMateria}
                    </th>
                    <td data-rotulo="Avaliações">
                      {avaliacoesDaLinha.length === 0 ? (
                        <span className="boletim-aluno__sem-avaliacoes">Nenhuma avaliação neste período</span>
                      ) : (
                        <div className="boletim-aluno__avaliacoes">
                          {avaliacoesDaLinha.map((avaliacao) => {
                            const invalido = lerCampo(rascunho[avaliacao.idAvaliacao] ?? "").invalido;
                            return (
                              <label key={avaliacao.idAvaliacao} className="boletim-aluno__avaliacao">
                                <span>
                                  {avaliacao.nomeAvaliacao}
                                  <small> peso {(avaliacao.peso ?? 1).toLocaleString("pt-BR")}</small>
                                </span>
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="10"
                                  inputMode="decimal"
                                  value={rascunho[avaliacao.idAvaliacao] ?? ""}
                                  aria-invalid={invalido}
                                  aria-label={`${avaliacao.nomeAvaliacao} de ${nomeMateria}`}
                                  onChange={(evento) =>
                                    setRascunho((atual) => ({
                                      ...atual,
                                      [avaliacao.idAvaliacao]: evento.target.value,
                                    }))
                                  }
                                />
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </td>
                    <td data-rotulo="Média Final" className="boletim-aluno__media">
                      {formatarMedia(media)}
                    </td>
                    <td data-rotulo="Total de Faltas">{faltas}</td>
                    <td data-rotulo="Situação">
                      <span className={`boletim-aluno__selo boletim-aluno__selo--${nivel}`}>
                        {ROTULO_SITUACAO[nivel]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <footer className="boletim-aluno__rodape">
        {temPendencias && <span className="boletim-aluno__pendente">Alterações não salvas</span>}
        <button type="button" onClick={salvar}>
          Salvar Boletim
        </button>
      </footer>

      {confirmandoSaida && (
        <ModalConfirmacao
          titulo="Sair sem salvar"
          mensagem="Há notas alteradas que ainda não foram salvas. Se voltar agora, elas serão perdidas."
          textoCancelar="Continuar editando"
          textoConfirmar="Descartar e voltar"
          aoConfirmar={aoVoltar}
          aoCancelar={() => setConfirmandoSaida(false)}
        />
      )}
    </section>
  );
}

export default BoletimAluno;
