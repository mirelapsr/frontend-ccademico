import { useRef, useState, type FormEvent } from "react";
import type { Materia } from "../../types";
import type { CriarMateriaDTO } from "../../services/materiaService";
import "./FormularioMateria.css";

interface FormularioMateriaProps {
  materiaEditando?: Materia | null;
  /**
   * Persiste na API. Deve LANÇAR em caso de falha: o formulário captura,
   * mostra a mensagem no topo e continua aberto com os dados preenchidos.
   */
  salvar: (dados: CriarMateriaDTO) => Promise<void>;
  cancelar: () => void;
}

function FormularioMateria({ materiaEditando, salvar, cancelar }: FormularioMateriaProps) {
  const [nomeMateria, setNomeMateria] = useState(materiaEditando?.nomeMateria ?? "");
  const [cargaHoraria, setCargaHoraria] = useState(
    materiaEditando?.cargaHoraria !== null && materiaEditando?.cargaHoraria !== undefined
      ? String(materiaEditando.cargaHoraria)
      : ""
  );
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // `useState` é assíncrono: o ref bloqueia o 2º clique no mesmo instante.
  const emEnvioRef = useRef(false);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (emEnvioRef.current) return;

    if (!nomeMateria.trim()) {
      setErro("O nome da matéria é obrigatório.");
      return;
    }

    // A API exige carga horária inteira e maior que zero (MateriaEntrada).
    const horas = Number(cargaHoraria);
    if (!cargaHoraria.trim() || !Number.isInteger(horas) || horas <= 0) {
      setErro("A carga horária é obrigatória e deve ser um número inteiro maior que zero.");
      return;
    }

    emEnvioRef.current = true;
    setEnviando(true);
    setErro(null);
    try {
      await salvar({ nomeMateria: nomeMateria.trim(), cargaHoraria: horas });
      // Sucesso: a página fecha o formulário.
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível salvar a matéria.");
    } finally {
      emEnvioRef.current = false;
      setEnviando(false);
    }
  }

  return (
    <section className="formulario-materia">
      <header className="formulario-materia__cabecalho">
        <h2>{materiaEditando ? "Editar Matéria" : "Nova Matéria"}</h2>
      </header>

      <form className="formulario-materia__form" onSubmit={handleSubmit} noValidate>
        {erro && (
          <p className="formulario-materia__erro" role="alert">
            {erro}
          </p>
        )}

        <label className="formulario-materia__campo formulario-materia__campo--largo">
          <span>Nome da matéria *</span>
          <input
            value={nomeMateria}
            onChange={(evento) => setNomeMateria(evento.target.value)}
            maxLength={80}
            placeholder="Ex.: Matemática"
            disabled={enviando}
          />
        </label>

        <label className="formulario-materia__campo">
          <span>Carga horária (h) *</span>
          <input
            type="number"
            min={1}
            value={cargaHoraria}
            onChange={(evento) => setCargaHoraria(evento.target.value)}
            placeholder="Ex.: 80"
            disabled={enviando}
          />
        </label>

        <div className="formulario-materia__acoes">
          <button
            type="button"
            className="formulario-materia__botao-cancelar"
            onClick={cancelar}
            disabled={enviando}
          >
            Cancelar
          </button>
          <button type="submit" className="formulario-materia__botao-salvar" disabled={enviando}>
            {enviando ? "Salvando..." : materiaEditando ? "Salvar alterações" : "Cadastrar matéria"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FormularioMateria;
