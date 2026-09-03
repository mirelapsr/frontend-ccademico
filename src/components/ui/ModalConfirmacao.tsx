import { useEffect } from "react";
import "./ModalConfirmacao.css";

interface ModalConfirmacaoProps {
  titulo: string;
  mensagem: string;
  textoCancelar: string;
  textoConfirmar: string;
  aoConfirmar: () => void;
  aoCancelar: () => void;
}


function ModalConfirmacao({
  titulo,
  mensagem,
  textoCancelar,
  textoConfirmar,
  aoConfirmar,
  aoCancelar,
}: ModalConfirmacaoProps) {
  useEffect(() => {
    function aoPressionarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        aoCancelar();
      }
    }
    document.addEventListener("keydown", aoPressionarTecla);
    return () => document.removeEventListener("keydown", aoPressionarTecla);
  }, [aoCancelar]);

  return (
    <div className="modal-confirmacao__overlay" onClick={aoCancelar}>
      <div
        className="modal-confirmacao__caixa"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-confirmacao-titulo"
        aria-describedby="modal-confirmacao-mensagem"
        // Impede que o clique dentro da caixa "vaze" pro overlay e feche o modal.
        onClick={(evento) => evento.stopPropagation()}
      >
        <h3 id="modal-confirmacao-titulo">{titulo}</h3>
        <p id="modal-confirmacao-mensagem">{mensagem}</p>

        <div className="modal-confirmacao__acoes">
          {/* Foco inicial no botão seguro (Cancelar), não no destrutivo —
              evita que um Enter acidental confirme a exclusão. */}
          <button
            type="button"
            className="modal-confirmacao__botao-cancelar"
            onClick={aoCancelar}
            autoFocus
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            className="modal-confirmacao__botao-confirmar"
            onClick={aoConfirmar}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmacao;
