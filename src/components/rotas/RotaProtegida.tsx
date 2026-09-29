import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Guarda de rota: só libera o `<Outlet />` (o `Layout` com a sidebar e as
 * páginas do sistema) para quem está autenticado; senão, manda para /login.
 */
function RotaProtegida() {
  const { autenticado, carregando } = useAuth();

  // Evita mandar para /login antes de terminar de ler o localStorage.
  if (carregando) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "var(--fonte-corpo)",
          color: "var(--texto-suave)",
        }}
      >
        Carregando...
      </div>
    );
  }

  if (!autenticado) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export default RotaProtegida;