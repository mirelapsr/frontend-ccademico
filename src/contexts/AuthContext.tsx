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

/** Resposta de POST /auth/login. snake_case de propósito: é o padrão OAuth2 (TokenSaida do backend). */
interface RespostaLogin {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface AuthContextValor {
  usuario: Usuario | null;
  /** Derivado de `usuario !== null`: nunca fica dessincronizado do usuário carregado. */
  autenticado: boolean;
  /** `true` enquanto a sessão persistida ainda está sendo revalidada em GET /auth/me. */
  carregando: boolean;
  /** Rejeita com `Error` (mensagem vinda da API) quando as credenciais não batem. */
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------

/** Chaves do AuthContext antigo (mock). O token real usa a chave do services/api.ts. */
const CHAVES_LEGADAS = ["@CAcademico:usuario", "@CAcademico:token"] as const;

function limparChavesLegadas(): void {
  try {
    CHAVES_LEGADAS.forEach((chave) => localStorage.removeItem(chave));
  } catch {
    // Armazenamento indisponível (ex.: modo privado): nada a limpar.
  }
}

function ehPapel(valor: unknown): valor is Papel {
  return typeof valor === "string" && (PAPEIS as readonly string[]).includes(valor);
}

/**
 * Converte o corpo de GET /auth/me em `Usuario`, validando o formato em tempo de execução
 * (o TypeScript não enxerga o que chega pela rede). Aceita `idUsuario` (alias camelCase da API)
 * ou `id_usuario`. Qualquer divergência vira erro em vez de um usuário "meio preenchido".
 */
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

  // Restaura a sessão: se há token salvo, o SERVIDOR decide se ele ainda vale (GET /auth/me).
  // O localStorage sozinho nunca autentica ninguém.
  useEffect(() => {
    limparChavesLegadas();

    if (!obterToken()) {
      setCarregando(false);
      return;
    }

    // `ativo` evita atualizar estado após o cleanup (StrictMode monta o efeito duas vezes em dev,
    // e a primeira resposta não deve sobrescrever nem apagar a sessão da segunda).
    let ativo = true;
    api
      .get<unknown>("/auth/me")
      .then((resposta) => {
        if (ativo) setUsuario(paraUsuario(resposta.data));
      })
      .catch(() => {
        // Token inválido/expirado, servidor fora do ar ou resposta fora do contrato:
        // não deixa credencial residual para trás.
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
    // OAuth2PasswordRequestForm do FastAPI exige application/x-www-form-urlencoded
    // com os nomes de campo "username" e "password".
    const { access_token } = await postForm<RespostaLogin>("/auth/login", {
      username: email.trim(),
      password: senha,
    });

    salvarToken(access_token);
    try {
      const resposta = await api.get<unknown>("/auth/me");
      setUsuario(paraUsuario(resposta.data));
    } catch (erro) {
      // Não existe "meio logado": se o perfil não carregou, descarta o token recém-gravado.
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
