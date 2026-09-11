/**
 * Convenção única para CPF neste projeto: o dado guardado (mock/localStorage)
 * é sempre só dígitos — é o que o `CHECK (cpf ~ '^[0-9]{11}$')` do banco
 * exige em `aluno`, `professor` e `responsavel`. A máscara (`000.000.000-00`)
 * só existe na hora de exibir (`formatarCpf`) ou de digitar; ao salvar, todo
 * `Formulario*` limpa o valor com `limparCpf` antes de chamar `salvar()`.
 */

export function limparCpf(valor: string): string {
  return valor.replace(/\D/g, "").slice(0, 11);
}

export function formatarCpf(cpf: string | null | undefined): string | null {
  if (!cpf) return null;
  const digitos = limparCpf(cpf);
  if (digitos.length !== 11) return cpf;
  return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
