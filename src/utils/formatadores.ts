// ---------------------------------------------------------------------------
// HIGIENIZAÇÃO (Apenas dígitos numéricos)
// ---------------------------------------------------------------------------

export function limparDigitos(valor: string | null | undefined): string {
  if (!valor) return "";
  return valor.replace(/\D/g, "");
}

export function limparCpf(valor: string | null | undefined): string {
  return limparDigitos(valor).slice(0, 11);
}

export function limparCnpj(valor: string | null | undefined): string {
  return limparDigitos(valor).slice(0, 14);
}

export function limparCep(valor: string | null | undefined): string {
  return limparDigitos(valor).slice(0, 8);
}

export function limparTelefone(valor: string | null | undefined): string {
  return limparDigitos(valor).slice(0, 11);
}

// ---------------------------------------------------------------------------
// MÁSCARAS DE ENTRADA (Digitação em Tempo Real e Exibição)
// ---------------------------------------------------------------------------

export function formatarCpf(valor: string | null | undefined): string {
  const d = limparCpf(valor);
  if (!d) return "";
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
}

export function formatarCnpj(valor: string | null | undefined): string {
  const d = limparCnpj(valor);
  if (!d) return "";
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12, 14)}`;
}

export function formatarCep(valor: string | null | undefined): string {
  const d = limparCep(valor);
  if (!d) return "";
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5, 8)}`;
}

export function formatarTelefone(valor: string | null | undefined): string {
  const d = limparTelefone(valor);
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  }
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
}

// ---------------------------------------------------------------------------
// VALIDAÇÕES ALGORÍTMICAS (Client-Side)
// ---------------------------------------------------------------------------

export function validarCpf(cpf: string | null | undefined): boolean {
  const d = limparCpf(cpf);
  if (d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(d.charAt(i), 10) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  const d1 = resto === 10 ? 0 : resto;
  if (d1 !== parseInt(d.charAt(9), 10)) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(d.charAt(i), 10) * (11 - i);
  }
  resto = (soma * 10) % 11;
  const d2 = resto === 10 ? 0 : resto;
  if (d2 !== parseInt(d.charAt(10), 10)) return false;

  return true;
}

export function validarCnpj(cnpj: string | null | undefined): boolean {
  const d = limparCnpj(cnpj);
  if (d.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(d)) return false;

  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(d.charAt(i), 10) * pesos1[i];
  }
  let resto = soma % 11;
  const d1 = resto < 2 ? 0 : 11 - resto;
  if (d1 !== parseInt(d.charAt(12), 10)) return false;

  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  soma = 0;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(d.charAt(i), 10) * pesos2[i];
  }
  resto = soma % 11;
  const d2 = resto < 2 ? 0 : 11 - resto;
  if (d2 !== parseInt(d.charAt(13), 10)) return false;

  return true;
}