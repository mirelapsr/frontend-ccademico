// Caminho: src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface Usuario {
  nome: string;
  email: string;
  papel: string;
}

interface AuthContextValor {
  usuario: Usuario | null;
  autenticado: boolean;
  carregando: boolean;
  /** Rejeita com `Error` quando as credenciais não batem — a tela lê `error.message`. */
  login: (emailOuMatricula: string, senha: string) => Promise<void>;
  logout: () => void;
}

const CHAVE_USUARIO = "@CAcademico:usuario";
const CHAVE_TOKEN = "@CAcademico:token";
const TEMPO_SIMULADO_MS = 800;

const AuthContext = createContext<AuthContextValor | undefined>(undefined);

function lerUsuarioSalvo(): Usuario | null {
  try {
    const bruto = localStorage.getItem(CHAVE_USUARIO);
    return bruto ? (JSON.parse(bruto) as Usuario) : null;
  } catch {
    return null;
  }
}

/**
 * JWT "de mentirinha", só para o formato (header.payload.assinatura) ficar
 * parecido com o que a API real vai devolver — sem assinatura de verdade.
 */
function gerarTokenFalso(): string {
  const codificar = (objeto: unknown) => btoa(JSON.stringify(objeto));
  const cabecalho = codificar({ alg: "none", typ: "JWT" });
  const carga = codificar({ sub: "mock-professor", exp: Date.now() + 1000 * 60 * 60 });
  return `${cabecalho}.${carga}.assinatura-mock`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Verificação inicial da sessão persistida — roda uma vez, depois da
  // montagem, para o RotaProtegida saber esperar antes de decidir redirecionar.
  useEffect(() => {
    setUsuario(lerUsuarioSalvo());
    setCarregando(false);
  }, []);

  /**
   * Mock de autenticação: sem API ainda (o backend FastAPI ainda não está
   * plugado), então só simula a latência de rede (800ms) e aceita qualquer
   * identificador não vazio com senha de mais de 3 caracteres. Trocar por
   * uma chamada real é o único ponto a mexer quando o backend existir.
   */
  function login(emailOuMatricula: string, senha: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const identificador = emailOuMatricula.trim();
        const identificadorValido = identificador.length > 0;

        if (!identificadorValido || senha.length <= 3) {
          reject(new Error("E-mail, matrícula ou senha inválidos. Confira os dados e tente novamente."));
          return;
        }

        const usuarioMock: Usuario = {
          nome: "Prof. Carlos",
          email: identificador.includes("@") ? identificador : "kitkatchocolate14465@gmail.com",
          papel: "ADMIN",
        };

        setUsuario(usuarioMock);
        try {
          localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuarioMock));
          localStorage.setItem(CHAVE_TOKEN, gerarTokenFalso());
        } catch {
          // Armazenamento indisponível (ex.: modo privado) — segue autenticado
          // só em memória, pelo resto desta sessão.
        }
        resolve();
      }, TEMPO_SIMULADO_MS);
    });
  }

  function logout() {
    setUsuario(null);
    try {
      localStorage.removeItem(CHAVE_USUARIO);
      localStorage.removeItem(CHAVE_TOKEN);
    } catch {
      // ignore
    }
  }

  return (
    <AuthContext.Provider
      value={{ usuario, autenticado: usuario !== null, carregando, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValor {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth precisa ser usado dentro de um <AuthProvider>.");
  }
  return contexto;
}