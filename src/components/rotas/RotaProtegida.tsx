// Caminho: src/components/RotaProtegida.tsx
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, type Papel } from "../../contexts/AuthContext";

interface RotaProtegidaProps {
  /**
   * Papéis autorizados a ver as rotas filhas. Omitido = qualquer usuário autenticado.
   * Informado (mesmo vazio) = só entra quem tiver um dos papéis listados (falha fechada).
   */
  papeisPermitidos?: readonly Papel[];
}

const estiloCentralizado = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  minHeight: "100vh",
  padding: "var(--espaco)",
  textAlign: "center",
  fontFamily: "var(--fonte-corpo)",
  color: "var(--texto-suave)",
} as const;

/**
 * Guarda de rota (layout route): só libera o `<Outlet />` para quem está autenticado
 * e, opcionalmente, tem um dos papéis em `papeisPermitidos`.
 *
 *   <Route element={<RotaProtegida />}>                                   // qualquer autenticado
 *   <Route element={<RotaProtegida papeisPermitidos={["ADMIN"]} />}>      // só ADMIN
 */
function RotaProtegida({ papeisPermitidos }: RotaProtegidaProps) {
  const { autenticado, carregando, usuario } = useAuth();
  const localizacao = useLocation();

  // Enquanto a sessão persistida é revalidada em /auth/me não dá para decidir:
  // redirecionar agora derrubaria para /login quem tem sessão válida (e recarregou a página).
  if (carregando) {
    return (
      <div role="status" aria-live="polite" style={estiloCentralizado}>
        Carregando...
      </div>
    );
  }

  if (!autenticado || usuario === null) {
    // `replace`: o botão "voltar" não retorna a uma página protegida. `from` permite
    // devolver o usuário ao destino original depois do login.
    return <Navigate to="/login" replace state={{ from: localizacao }} />;
  }

  if (papeisPermitidos !== undefined && !papeisPermitidos.includes(usuario.papel)) {
    // Autenticado, mas sem permissão: mensagem em vez de redirecionar (um redirect
    // para "/" poderia entrar em laço se "/" também exigisse um papel que ele não tem).
    return (
      <div role="alert" style={estiloCentralizado}>
        <h1 style={{ margin: 0, fontFamily: "var(--fonte-titulo)", color: "var(--texto)" }}>Acesso negado</h1>
        <p style={{ margin: 0 }}>Seu perfil ({usuario.papel}) não tem permissão para acessar esta área.</p>
        <Link to="/" style={{ color: "var(--azul-acao)" }}>
          Voltar ao início
        </Link>
      </div>
    );
  }

  return <Outlet />;
}

export default RotaProtegida;
