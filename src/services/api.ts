const BASE_URL = 'http://127.0.0.1:8000';

interface RequestOptions extends RequestInit {
  bodyData?: any;
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { bodyData, ...customOptions } = options;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customOptions.headers,
  };

  const config: RequestInit = {
    ...customOptions,
    headers,
    body: bodyData !== undefined ? JSON.stringify(bodyData) : customOptions.body,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let detalheErro = 'Erro na comunicação com o servidor';
    try {
      const jsonErro = await response.json();
      detalheErro = jsonErro.detail || detalheErro;
    } catch {
      detalheErro = response.statusText;
    }
    throw new Error(detalheErro);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data: any) => apiRequest<T>(endpoint, { method: 'POST', bodyData: data }),
  patch: <T>(endpoint: string, data: any) => apiRequest<T>(endpoint, { method: 'PATCH', bodyData: data }),
  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),
};