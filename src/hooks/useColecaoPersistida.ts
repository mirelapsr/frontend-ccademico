import { useState } from "react";
import { carregarColecao, salvarColecao } from "../storage";

type Atualizador<T> = T[] | ((atual: T[]) => T[]);

/**
 * Estado de uma coleção com o `localStorage` como fonte única de verdade.
 *
 * Na montagem, lê a coleção do `localStorage` (inicializando a partir do
 * mock se a chave ainda não existir). Toda chamada ao setter retornado
 * grava a lista atualizada no `localStorage` de forma síncrona, dentro do
 * próprio cálculo do novo estado — antes do próximo componente que montar
 * (ex.: ao navegar para outra página) ler essa mesma chave. Tem a mesma
 * assinatura do setter do `useState` (aceita valor novo ou função), então
 * serve como substituto direto de `useState<T[]>(mock)`.
 */
export function useColecaoPersistida<T>(chave: string, mockInicial: T[]) {
  const [dados, setDadosState] = useState<T[]>(() => carregarColecao(chave, mockInicial));

  function setDados(atualizador: Atualizador<T>) {
    setDadosState((atual) => {
      const novaLista =
        typeof atualizador === "function"
          ? (atualizador as (atual: T[]) => T[])(atual)
          : atualizador;
      salvarColecao(chave, novaLista);
      return novaLista;
    });
  }

  return [dados, setDados] as const;
}
