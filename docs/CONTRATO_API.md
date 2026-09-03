# Contrato da API — a especificação dos dados

Este é o documento mais importante do trabalho depois do enunciado. Ele
descreve **o formato dos dados** com que o seu frontend trabalha.

Esse formato **não é uma escolha sua**: é o que a API de gestão escolar do
**Módulo I** (FastAPI + PostgreSQL) devolve. No **Módulo III** vamos ligar este
frontend nessa API de verdade. Se os seus tipos e o seu mock seguirem este
contrato, a integração vai ser trocar o miolo do `api.ts` por `fetch`. Se você
inventar nomes de campo, nada encaixa e o trabalho precisa ser refeito.

> **Você NÃO precisa da API rodando** para fazer este trabalho. Ela é o
> **destino**, não um pré-requisito. Aqui os dados vêm do `mock.ts`.

---

## Aluno

É o que a API devolve em `GET /alunos` (uma lista) e `GET /alunos/{id}`:

```json
{
  "id": 1,
  "nome": "Ana Souza",
  "idade": 20,
  "matricula": "2026001",
  "media": 8.5
}
```

| Campo | Tipo TS | Regras |
|---|---|---|
| `id` | `number` | gerado pelo banco; **não** existe antes de criar |
| `nome` | `string` | 1 a 100 caracteres |
| `idade` | `number` | inteiro, de 0 a 120 |
| `matricula` | `string` | **texto**, não número (pode ter zeros à esquerda); **única** no sistema |
| `media` | `number` | de 0 a 10, com uma casa decimal (ex.: `8.5`) |

> ⚠️ **`matricula` é `string`.** `"2026001"` é um código, não uma quantidade.
> Trocar por `number` é o erro mais comum aqui e quebra a integração.

Para **criar** um aluno, o cliente manda os mesmos campos **sem o `id`** — é o
seu `AlunoEntrada`.

## Disciplina

`GET /disciplinas`:

```json
{ "id": 1, "nome": "Python", "carga_horaria": 40 }
```

| Campo | Tipo TS | Regras |
|---|---|---|
| `id` | `number` | gerado pelo banco |
| `nome` | `string` | **único** no sistema |
| `carga_horaria` | `number` | inteiro **maior que zero** |

> ⚠️ É `carga_horaria` (com underline), **não** `cargaHoraria`. O JSON vem do
> Python, que usa `snake_case`. Mantenha igual.

## Matrícula (aluno ↔ disciplina)

Um aluno cursa várias disciplinas; uma disciplina tem vários alunos. A ligação
é feita por pares de ids:

```json
{ "aluno_id": 1, "disciplina_id": 3 }
```

Na API, `GET /alunos/{id}/disciplinas` devolve as disciplinas de um aluno (é um
`JOIN` no banco). Isso aparece nos **bônus** do trabalho.

---

## Endpoints (o mapa do Módulo III)

Cada função do seu `api.ts` corresponde a um endpoint. Escreva as funções com
essa correspondência em mente:

| Sua função em `api.ts` | Endpoint no Módulo III | Resposta |
|---|---|---|
| `listarAlunos(filtros?)` | `GET /alunos?q=&idade_minima=&media_minima=` | 200 · `Aluno[]` |
| `buscarAluno(id)` | `GET /alunos/{id}` | 200 · `Aluno` · **404** se não existe (bônus) |
| `criarAluno(dados)` | `POST /alunos` | **201** · `Aluno` · **409** se matrícula repetida |
| `atualizarAluno(id, campos)` | `PATCH /alunos/{id}` | 200 · `Aluno` (bônus) |
| `excluirAluno(id)` | `DELETE /alunos/{id}` | **204** · **404** se não existe |
| `listarDisciplinas()` | `GET /disciplinas` | 200 · `Disciplina[]` (bônus) |
| `disciplinasDoAluno(id)` | `GET /alunos/{id}/disciplinas` | 200 · `Disciplina[]` (bônus) |

### O que os status HTTP viram na sua tela

Você não usa HTTP ainda, mas as **regras** já valem — simule-as no `api.ts`
lançando erros (`throw new Error(...)`), e trate na tela:

| Regra da API | O que o seu app faz |
|---|---|
| `409` matrícula duplicada | mensagem no formulário: "já existe aluno com essa matrícula" — e **não** adiciona |
| `404` aluno inexistente | mensagem de "aluno não encontrado" |
| `422` idade fora de 0–120, média fora de 0–10 | o formulário **impede** o envio e avisa o usuário |

> É por isso que o `api.ts` lança erros em vez de devolver `null`: no Módulo III,
> um `fetch` com status 409 vira exatamente esse `throw`, e a sua tela continua
> funcionando sem alteração.

## Filtros da listagem

Os três filtros do `GET /alunos` são os mesmos que o seu app deve oferecer:

| Query param | Significado | Comportamento |
|---|---|---|
| `q` | busca por nome | contém o texto, **ignorando maiúsculas/minúsculas** |
| `idade_minima` | idade mínima | `idade >= valor` |
| `media_minima` | média mínima | `media >= valor` |

**São combináveis:** com dois filtros ativos, o aluno precisa satisfazer os
dois (`?q=ana&idade_minima=18`).
