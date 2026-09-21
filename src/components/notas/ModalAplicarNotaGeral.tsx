import { useEffect, useState } from "react";
import "./ModalAplicarNotaGeral.css";

interface ModalAplicarNotaGeralProps {
  aoConfirmar: (valorNota: number) => void;
  aoCancelar: () => void;
}

function ModalAplicarNotaGeral({ aoConfirmar, aoCancelar }: ModalAplicarNotaGeralProps) {
  const [valor, setValor] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    function aoPressionarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        aoCancelar();
      }
    }
    document.addEventListener("keydown", aoPressionarTecla);
    return () => document.removeEventListener("keydown", aoPressionarTecla);
  }, [aoCancelar]);

  function handleConfirmar() {
    const numero = Number(valor.replace(",", "."));
    if (valor.trim() === "" || Number.isNaN(numero) || numero < 0 || numero > 10) {
      setErro("Informe uma nota válida entre 0,0 e 10,0.");
      return;
    }
    aoConfirmar(numero);
  }

  return (
    <div className="modal-nota-geral__overlay" onClick={aoCancelar}>
      <div
        className="modal-nota-geral__caixa"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-nota-geral-titulo"
        onClick={(evento) => evento.stopPropagation()}
      >
        <h3 id="modal-nota-geral-titulo">Aplicar Nota Geral</h3>
        <p>Essa nota será aplicada a todos os alunos listados nesta avaliação.</p>

        <label className="modal-nota-geral__campo">
          <span>Nota (0,0 a 10,0)</span>
          <input
            type="number"
            min={0}
            max={10}
            step="0.1"
            value={valor}
            onChange={(evento) => setValor(evento.target.value)}
            autoFocus
          />
        </label>

        {erro && (
          <p className="modal-nota-geral__erro" role="alert">
            {erro}
          </p>
        )}

        <div className="modal-nota-geral__acoes">
          <button type="button" className="modal-nota-geral__botao-cancelar" onClick={aoCancelar}>
            Cancelar
          </button>
          <button type="button" className="modal-nota-geral__botao-confirmar" onClick={handleConfirmar}>
            Confirmar e Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalAplicarNotaGeral;
