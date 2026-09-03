import { useEffect } from "react";
import "./Toast.css";

export type TipoToast = "sucesso" | "erro";

interface ToastProps {
  mensagem: string;
  tipo?: TipoToast;
  aoFechar: () => void;
  duracaoMs?: number;
}


function Toast({ mensagem, tipo = "sucesso", aoFechar, duracaoMs = 3000 }: ToastProps) {
  useEffect(() => {
    const temporizador = setTimeout(aoFechar, duracaoMs);
    return () => clearTimeout(temporizador);
  }, [aoFechar, duracaoMs, mensagem]);

  return (
    <div className={`toast toast--${tipo}`} role="status" aria-live="polite">
      {mensagem}
    </div>
  );
}

export default Toast;
