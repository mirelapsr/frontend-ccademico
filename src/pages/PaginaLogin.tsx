import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logoBrasao from "../assets/logo-brasao.jpg"; 
import "./PaginaLogin.css";

function PaginaLogin() {
  const { autenticado, login } = useAuth();
  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [mostrarAjudaSenha, setMostrarAjudaSenha] = useState(false);

  if (autenticado) return <Navigate to="/" replace />;

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (identificador.trim() === "" || senha.trim() === "") {
      setErro("Preencha e-mail/matrícula e senha.");
      return;
    }

    setEnviando(true);
    try {
      await login(identificador, senha);
    } catch (erroLogin) {
      setErro(
        erroLogin instanceof Error
          ? erroLogin.message
          : "E-mail, matrícula ou senha inválidos. Confira os dados e tente novamente."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-login">
      <section className="pagina-login__marca">
        <img src={logoBrasao} alt="" className="pagina-login__marca-dagua" aria-hidden="true" />
        <div className="pagina-login__marca-conteudo">
          <h1>Controle Acadêmico</h1>
          <p>Portal Escolar</p>
        </div>
      </section>

      <section className="pagina-login__area-formulario">
        <div className="pagina-login__cartao">
          <h2>Entrar</h2>
          <p className="pagina-login__instrucao">Acesse com seu e-mail institucional ou matrícula.</p>

          <form onSubmit={handleSubmit} noValidate>
            <label className="pagina-login__campo">
              <span>E-mail ou matrícula</span>
              <span className="pagina-login__campo-caixa">
                <IconeUsuario />
                <input
                  type="text"
                  value={identificador}
                  onChange={(evento) => {
                    setIdentificador(evento.target.value);
                    setErro(null);
                  }}
                  placeholder="admin@escola.com"
                  autoComplete="username"
                  aria-invalid={erro !== null}
                  required
                />
              </span>
            </label>

            <label className="pagina-login__campo">
              <span>Senha</span>
              <span className="pagina-login__campo-caixa">
                <IconeCadeado />
                <input
                  type="password"
                  value={senha}
                  onChange={(evento) => {
                    setSenha(evento.target.value);
                    setErro(null);
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-invalid={erro !== null}
                  required
                />
              </span>
            </label>

            {erro && (
              <p className="pagina-login__erro" role="alert">
                {erro}
              </p>
            )}

            <button type="submit" disabled={enviando}>
              {enviando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <button
            type="button"
            className="pagina-login__link-secundario"
            onClick={() => setMostrarAjudaSenha((atual) => !atual)}
          >
            Esqueci minha senha
          </button>

          {mostrarAjudaSenha && (
            <p className="pagina-login__ajuda-senha">
              Procure a secretaria da escola para redefinir sua senha de acesso.
            </p>
          )}
        </div>

        <p className="pagina-login__rodape">2026 Controle Acadêmico. Todos os direitos reservados.</p>
      </section>
    </div>
  );
}

export default PaginaLogin;

function IconeUsuario() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false">
      <circle cx="10" cy="6.6" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.6,17 Q10,10.8 16.4,17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconeCadeado() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false">
      <rect x="4.5" y="9" width="11" height="8.5" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6.8,9 V6.4 A3.2,3.2 0 0 1 13.2,6.4 V9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="10" cy="12.7" r="1.15" fill="currentColor" />
    </svg>
  );
}