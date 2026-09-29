import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./TopBar.css";

interface TopBarProps {
  sidebarAberta: boolean;
  aoAlternarSidebar: () => void;
}

function obterIniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

function TopBar({ sidebarAberta, aoAlternarSidebar }: TopBarProps) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function aoClicarFora(evento: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(evento.target as Node)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, []);

  function irParaPerfil() {
    setMenuAberto(false);
    navigate("/perfil");
  }

  function sair() {
    setMenuAberto(false);
    logout();
    navigate("/login");
  }

  const nomeUsuario = usuario?.nome ?? "Usuário";

  return (
    <header className="topbar">
      <button
        type="button"
        className="topbar__botao-menu"
        onClick={aoAlternarSidebar}
        aria-label={sidebarAberta ? "Recolher menu lateral" : "Expandir menu lateral"}
        aria-pressed={!sidebarAberta}
      >
        ☰
      </button>

      <div className="topbar__acoes">

        <div className="topbar__perfil" ref={menuRef}>
          <button
            type="button"
            className="topbar__botao-perfil"
            onClick={() => setMenuAberto((atual) => !atual)}
            aria-haspopup="menu"
            aria-expanded={menuAberto}
          >
            <span className="topbar__avatar" aria-hidden="true">
              {obterIniciais(nomeUsuario)}
            </span>
            <span className="topbar__nome">{nomeUsuario}</span>
            <span className="topbar__seta" aria-hidden="true">
              ▾
            </span>
          </button>

          {menuAberto && (
            <div className="topbar__dropdown" role="menu">
              <button
                type="button"
                className="topbar__dropdown-item"
                role="menuitem"
                onClick={irParaPerfil}
              >
                Alterar Perfil
              </button>
              <button
                type="button"
                className="topbar__dropdown-item topbar__dropdown-item--sair"
                role="menuitem"
                onClick={sair}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;