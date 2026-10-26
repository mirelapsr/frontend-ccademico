// Caminho: src/contexts/AuthContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, obterToken, postForm, removerToken, salvarToken } from "../services/api";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export const PAPEIS = ["ADMIN", "PROFESSOR", "SECRETARIA"] as const;
export type Papel = (typeof PAPEIS)[number];

export interface Usuario {
  idUsuario: number;
  nome: string;
  email: string;
  papel: Papel;
}


interface RespostaLogin {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface AuthContextValor {
  usuario: Usuario | null;
  autenticado: boolean;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------

const CHAVES_LEGADAS = ["@CAcademico:usuario", "@CAcademico:token"] as const;

function limparChavesLegadas(): void {
  try {
    CHAVES_LEGADAS.forEach((chave) => localStorage.removeItem(chave));
  } catch {
  }
}

function ehPapel(valor: unknown): valor is Papel {
  return typeof valor === "string" && (PAPEIS as readonly string[]).includes(valor);
}

function paraUsuario(corpo: unknown): Usuario {
  const bruto = (typeof corpo === "object" && corpo !== null ? corpo : {}) as Record<string, unknown>;
  const id = bruto.idUsuario ?? bruto.id_usuario;
  const { nome, email, papel } = bruto;

  if (typeof id !== "number" || typeof nome !== "string" || typeof email !== "string" || !ehPapel(papel)) {
    throw new Error("Resposta inválida do servidor ao carregar o perfil do usuário.");
  }
  return { idUsuario: id, nome, email, papel };
}

// ---------------------------------------------------------------------------
// Contexto
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValor | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    limparChavesLegadas();

    if (!obterToken()) {
      setCarregando(false);
      return;
    }

    let ativo = true;
    api
      .get<unknown>("/auth/me")
      .then((resposta) => {
        if (ativo) setUsuario(paraUsuario(resposta.data));
      })
      .catch(() => {

        if (ativo) {
          removerToken();
          setUsuario(null);
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const login = useCallback(async (email: string, senha: string): Promise<void> => {

    const { access_token } = await postForm<RespostaLogin>("/auth/login", {
      username: email.trim(),
      password: senha,
    });

    salvarToken(access_token);
    try {
      const resposta = await api.get<unknown>("/auth/me");
      setUsuario(paraUsuario(resposta.data));
    } catch (erro) {

      removerToken();
      setUsuario(null);
      throw erro;
    }
  }, []);

  const logout = useCallback((): void => {
    removerToken();
    setUsuario(null);
  }, []);

  const valor = useMemo<AuthContextValor>(
    () => ({ usuario, autenticado: usuario !== null, carregando, login, logout }),
    [usuario, carregando, login, logout],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValor {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth precisa ser usado dentro de um <AuthProvider>.");
  }
  return contexto;
}
