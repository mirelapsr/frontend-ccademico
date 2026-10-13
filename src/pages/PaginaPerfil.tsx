import { useState, type FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import Toast from "../components/ui/Toast";
import "./PaginaPerfil.css";

function PaginaPerfil() {
  const { usuario } = useAuth();

  const [nomeCompleto, setNomeCompleto] = useState(usuario?.nome ?? "");
  const [emailOuMatricula, setEmailOuMatricula] = useState(usuario?.email ?? "");
  const [novaSenha, setNovaSenha] = useState("");
  const [mostrarToast, setMostrarToast] = useState(false);

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setNovaSenha("");
    setMostrarToast(true);
  }

  return (
    <div className="pagina-perfil">
      <header className="pagina-perfil__cabecalho">
        <h1>Meu Perfil</h1>
        <p>Gerencie suas informações pessoais e credenciais</p>
      </header>

      <form className="pagina-perfil__form" onSubmit={handleSubmit} noValidate>
        <label className="pagina-perfil__campo">
          <span>Nome completo</span>
          <input
            value={nomeCompleto}
            onChange={(evento) => setNomeCompleto(evento.target.value)}
            placeholder="Seu nome completo"
          />
        </label>

        <label className="pagina-perfil__campo">
          <span>E-mail / Matrícula</span>
          <input
            value={emailOuMatricula}
            onChange={(evento) => setEmailOuMatricula(evento.target.value)}
            placeholder="seu@email.com"
          />
        </label>

        <label className="pagina-perfil__campo">
          <span>Nova senha</span>
          <input
            type="password"
            value={novaSenha}
            onChange={(evento) => setNovaSenha(evento.target.value)}
            placeholder="Deixe em branco para manter a senha atual"
          />
        </label>

        <div className="pagina-perfil__acoes">
          <button type="submit">Salvar Alterações</button>
        </div>
      </form>

      {mostrarToast && (
        <Toast mensagem="Perfil atualizado com sucesso." aoFechar={() => setMostrarToast(false)} />
      )}
    </div>
  );
}

export default PaginaPerfil;