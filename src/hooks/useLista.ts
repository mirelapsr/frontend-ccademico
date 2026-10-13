import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { api } from "../services/api";

export interface RetornoUseLista<T> {
  dados: T[];
  carregando: boolean;
  erro: string | null;
  recarregar: () => Promise<void>;
  setDados: Dispatch<SetStateAction<T[]>>;
}

export function useLista<T>(url: string, params?: Record<string, unknown>): RetornoUseLista<T> {
  const [dados, setDados] = useState<T[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const parametrosRef = useRef(params);
  parametrosRef.current = params;
  const chaveParametros = JSON.stringify(params ?? {});
  const requisicaoAtual = useRef(0);

  const recarregar = useCallback(async () => {
    const requisicao = ++requisicaoAtual.current;
    setCarregando(true);
    setErro(null);
    try {
      const { data } = await api.get<T[]>(url, { params: parametrosRef.current });
      if (requisicao === requisicaoAtual.current) setDados(data);
    } catch (e: unknown) {
      if (requisicao === requisicaoAtual.current) {
        setErro(e instanceof Error ? e.message : "Erro ao carregar dados.");
      }
    } finally {
      if (requisicao === requisicaoAtual.current) setCarregando(false);
    }
  }, [url, chaveParametros]);

  useEffect(() => {
    void recarregar();
    return () => {
      requisicaoAtual.current += 1;
    };
  }, [recarregar]);

  return { dados, carregando, erro, recarregar, setDados };
}
