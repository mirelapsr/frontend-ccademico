import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const TOKEN_KEY = '@CAcademic:token';


export class ApiError extends Error {
  status: number;

  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status;
  }
}


function extrairMensagem(detail: unknown): string {
  const padrao = 'Ocorreu um erro inesperado no servidor.';
  if (typeof detail === 'string' && detail.trim()) return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    const partes = detail.map((item: { loc?: unknown[]; msg?: string }) => {
      const campo = Array.isArray(item.loc)
        ? item.loc.filter((parte) => parte !== 'body').join('.')
        : '';
      const msg = item.msg ?? 'valor inválido';
      return campo ? `${campo}: ${msg}` : msg;
    });
    return partes.join(' • ');
  }
  return padrao;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 40000,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }


    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// RESPONSE INTERCEPTOR: Tratamento de Erros e Sessão Expirada
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: unknown }>) => {
    if (!error.response) {
      console.error('Falha de conexão com a API.');
      return Promise.reject(new ApiError('Servidor indisponível. Verifique sua conexão.', 0));
    }

    const { status, config } = error.response;
    const url = config?.url || '';


    if (status === 401) {
    
      if (!url.includes('/auth/login')) {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = '/login';
        return Promise.reject(new ApiError('Sessão expirada. Faça login novamente.', 401));
      }
    }

    const mensagemErro = extrairMensagem(error.response.data?.detail);

    return Promise.reject(new ApiError(mensagemErro, status));
  }
);

// ---------------------------------------------------------------------------
// HELPER: Login com OAuth2 (application/x-www-form-urlencoded)
// ---------------------------------------------------------------------------
export async function postForm<T>(url: string, data: Record<string, string>): Promise<T> {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    params.append(key, value);
  });

  const response = await api.post<T>(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
}

// ---------------------------------------------------------------------------
// HELPERS DE TOKEN
// ---------------------------------------------------------------------------
export function salvarToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function obterToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function removerToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

(window as any).api = api;
(window as any).postForm = postForm;