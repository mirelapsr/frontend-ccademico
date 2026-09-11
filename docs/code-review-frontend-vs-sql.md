# Code Review — Front-end (React/TS) vs. `controle.sql`

**Escopo:** comparação entre `src/types.ts` (+ estrutura de `src/components` e `src/pages`) e o schema PostgreSQL em `controle.sql`.

**Observação de partida:** o cabeçalho do próprio `types.ts` diz que ele é "espelho fiel do contrato JSON da API do Módulo I (FastAPI + Pydantic)". Isso importa: o alvo real de conformidade é o schema Pydantic exposto pela API, não o SQL diretamente — mas como `api.ts` ainda é um esqueleto (Módulo III), o SQL é hoje a melhor fonte de verdade disponível. Se o Pydantic um dia expuser/omitir campos de forma diferente do SQL puro, esta análise precisa ser revisitada.

---

## Resumo executivo

| Prioridade | Achado |
|---|---|
| 🔴 Crítico | Não existe nenhum tipo/tela para `alunoresponsavel` — a regra "1 responsável financeiro por aluno" não tem onde ser aplicada no front hoje |
| 🔴 Crítico | `FormularioMatricula` não valida "matrícula ativa única por aluno" — hoje só o trigger do banco pegaria isso, e como um erro 500 cru |
| 🟡 Importante | `Professor` e `Responsavel` têm campos de contato tipados como obrigatórios (`string`), mas no SQL são todos `NULL`-áveis |
| 🟡 Importante | CPF: mock guarda formatado (`123.456.789-01`), mas o `CHECK` do banco exige só dígitos (`^[0-9]{11}$`) — vai quebrar no insert |
| 🟡 Importante | `FormularioPeriodo` valida `dataFim < dataInicio` como erro; o `CHECK` do banco é `data_fim > data_inicio` (datas iguais também deveriam ser erro) |
| 🟢 Observação | 7 tabelas inteiras (`boleto`, `boletim`, `nota`, `avaliacao`, `frequencia`, `grade_curricular`, `alunoresponsavel`) e as 3 views ainda não têm nenhuma representação no front — esperado nesta fase, mas vale nomear o que falta |
| 🟢 Positivo | `Escola`, `Turma`, `Matricula`, `Materia` batem muito bem com o SQL (nullability, CHECKs de enum e até a ausência de timestamps em `materia` foram respeitadas) |

---

## 1. Mapeamento de Entidades

### Vão bem (sem ação necessária)

- **`Escola` ↔ `escola`**: nullability de `codigoInep`/`cnpj`/`enderecoEscola`/`telefoneEscola`/`emailEscola` bate com as colunas (nenhuma é `NOT NULL` além de `nome_escola`).
- **`Turma` ↔ `turma`**: `Turno` mapeia exatamente o `CHECK` (`'Manha','Tarde','Noite','Integral'`), `capacidade?: number | null` bate com `INTEGER` nulo + `CHECK (capacidade IS NULL OR capacidade > 0)`, `serie` opcional bate com a coluna nula.
- **`Matricula` ↔ `matricula`**: `SituacaoMatricula` bate 1:1 com o `CHECK` (`'Ativa','Cancelada','Transferida','Concluida'`).
- **`Materia` ↔ `materia`**: a decisão de *não* incluir `criadoEm`/`atualizadoEm` estava certa — a tabela `materia` de fato não tem essas colunas (é a única tabela do schema sem trigger de timestamp). Bom sinal de que o tipo foi conferido contra o SQL e não só copiado do padrão das outras entidades.
- **`Aluno` ↔ `aluno`**: `SituacaoAluno` bate com o `CHECK`, nullability dos campos de contato bate.

### Bugs de tipagem concretos

**a) `Professor` e `Responsavel` marcam campos `NOT NULL` que não são**

No SQL, nem `professor` nem `responsavel` têm `NOT NULL` em CPF/telefone/e-mail/CEP/endereço (só o nome é obrigatório):

```sql
-- professor
cpf_prof         VARCHAR(11) UNIQUE,      -- nulo permitido
telefone_prof    VARCHAR(13),
email_prof       VARCHAR(100),
cep_prof         VARCHAR(8),
endereco_prof    VARCHAR(200),
```

Mas em `types.ts`:

```ts
export interface Professor {
  ...
  cpfProf: string;        // deveria ser string | null
  telefoneProf: string;   // deveria ser string | null
  emailProf: string;      // deveria ser string | null
  cepProf: string;        // deveria ser string | null
  enderecoProf: string;   // deveria ser string | null
}
```

O mesmo vale, campo a campo, para `Responsavel`. Isso é uma regressão em relação ao padrão que `Aluno` já usa corretamente (`telefoneAluno: string | null` etc.) — vale alinhar os três para o mesmo padrão.

**b) CPF: formatado no mock, mas o banco exige só dígitos**

```sql
CONSTRAINT chk_cpf_aluno CHECK (cpf_aluno IS NULL OR cpf_aluno ~ '^[0-9]{11}$')
```

O `mock.ts` guarda `"123.456.789-01"` (11 dígitos + pontuação = 14 caracteres). Isso passa despercebido hoje porque tudo é `localStorage`, mas qualquer um desses registros, mandado como está para a API real, vai estourar o `CHECK`. Curiosamente o CNPJ da `Escola` foi guardado *sem* pontuação (`"12345678000190"`) — ou seja, já existe uma inconsistência interna entre como CPF e CNPJ são tratados no mesmo projeto.

Sugestão: decidir uma única convenção — guardar sempre dígitos puros (o que o banco quer) e aplicar máscara só na exibição/input (`formatarCpf()`/`limparCpf()` como funções puras reaproveitáveis) — em vez de guardar formatado e limpar na hora de enviar.

### Não existe no front ainda (7 tabelas + 3 views)

| Tabela/View | Papel no schema | Status no front |
|---|---|---|
| `alunoresponsavel` | Junção Aluno×Responsável + `tipo_responsavel` + flag financeiro | **Nenhum tipo** |
| `grade_curricular` | Junção Turma×Matéria×Professor | Nenhum tipo |
| `avaliacao` | Prova/Trabalho/Projeto por grade+período | Nenhum tipo |
| `nota` | Nota de aluno numa avaliação | Nenhum tipo |
| `frequencia` | Presença por grade+aluno+data | Nenhum tipo |
| `boletim` | Média final fechada por aluno+período+matéria | Nenhum tipo |
| `boleto` | Cobrança financeira do aluno | Nenhum tipo |
| `vw_aluno_escola_atual` | Escola atual do aluno via matrícula ativa | Nenhum uso |
| `vw_aluno_responsavel_financeiro` | Responsável financeiro do aluno | Nenhum uso |
| `vw_aluno_media_dinamica` | Média calculada nota×peso | Nenhum uso |

Isso é esperado dado o estágio do projeto (o build até agora cobriu exatamente as entidades "cadastrais" — Escola/Aluno/Turma/Matrícula/Professor/Matéria/Período/Responsável). Mas o ponto 2 abaixo mostra que uma dessas ausências (`alunoresponsavel`) já afeta uma regra de negócio que o enunciado deste review pede pra verificar explicitamente.

---

## 2. Relacionamentos e Regras de Negócio

### 🔴 Responsável financeiro único por aluno — regra sem lugar para existir

O banco implementa isso com uma tabela de junção própria, não como um campo solto em `responsavel`:

```sql
CREATE TABLE alunoresponsavel (
    aluno_id_aluno               INTEGER NOT NULL,
    responsavel_id_responsavel   INTEGER NOT NULL,
    tipo_responsavel             VARCHAR(50) NOT NULL, -- Pai/Mae/ResponsavelLegal/Outro
    responsavel_financeiro       BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (aluno_id_aluno, responsavel_id_responsavel),
    ...
);
-- + trigger que recusa um 2º responsavel_financeiro = TRUE pro mesmo aluno
```

O `Responsavel` do front, hoje, é uma entidade solta — o próprio comentário do tipo admite isso: *"o vínculo com Aluno fica para uma fase futura"*. Sem um tipo `AlunoResponsavel` (com `tipoResponsavel` e `responsavelFinanceiro`), não tem como:
- vincular um responsável a um aluno específico;
- marcar/alternar quem é o financeiro;
- muito menos bloquear um segundo financeiro *antes* de bater no banco.

**Sugestão de tipo** (calcado 1:1 no schema):

```ts
export type TipoResponsavel = "Pai" | "Mae" | "ResponsavelLegal" | "Outro";

export interface AlunoResponsavel {
  alunoIdAluno: number;
  responsavelIdResponsavel: number;
  tipoResponsavel: TipoResponsavel;
  responsavelFinanceiro: boolean;
}
```

E a regra espelhada no client, *antes* de deixar marcar `responsavelFinanceiro: true`:

```ts
const jaTemFinanceiro = vinculosDoAluno.some(
  (v) => v.responsavelFinanceiro && v.responsavelIdResponsavel !== vinculoEmEdicao?.responsavelIdResponsavel
);
if (jaTemFinanceiro) {
  setErro("Este aluno já tem um responsável financeiro. Desmarque o atual antes de definir outro.");
  return;
}
```

Isso não substitui o trigger (que continua sendo a garantia final) — só evita que o usuário só descubra a regra quando a API devolver um erro.

### 🔴 Matrícula ativa única por aluno — mesma lacuna, outro lugar

```sql
-- trigger em matricula: se NEW.situacao = 'Ativa' e já existir outra 'Ativa'
-- pro mesmo aluno, RAISE EXCEPTION
```

`FormularioMatricula.tsx` hoje deixa escolher qualquer `aluno` + qualquer `situacao` livremente — inclusive criar uma segunda matrícula `"Ativa"` pro mesmo aluno sem aviso nenhum. Vale o mesmo padrão do item anterior: antes de `salvar()`, checar se já existe uma matrícula `Ativa` para aquele `alunoIdAluno` (excluindo a que está sendo editada) e bloquear com uma mensagem clara — hoje o único "feedback" que o usuário teria seria o app quebrar na integração com o Módulo III.

### 🟡 `ON DELETE RESTRICT` em cascata — os `confirmarExclusao()` não sabem disso

Praticamente toda FK do schema é `ON DELETE RESTRICT`: não dá para apagar uma `escola` com `turma`/`professor` vinculados, nem uma `turma` com `matricula` vinculada, nem um `aluno` com `matricula`/`nota`/`boleto` vinculados, etc. Hoje, todo `confirmarExclusao()` do front (Escolas, Turmas, Alunos...) só faz `filter()` no array e segue — o que faz sentido *hoje* porque é tudo `localStorage` sem integridade referencial de verdade. Mas é um ponto cego que vai aparecer assim que a API real (Módulo III) devolver um erro de FK: vale já prever, nem que seja um `catch` genérico tratando esse tipo de erro com uma mensagem como *"Não é possível excluir: existem registros vinculados a este(a) \<entidade\>."*

### 🟡 `chk_periodo_datas`: off-by-one na validação

```sql
CONSTRAINT chk_periodo_datas CHECK (data_fim > data_inicio)  -- estritamente maior
```

`FormularioPeriodo.tsx` valida:

```ts
if (dataFim < dataInicio) {
  setErro("A data de término não pode ser anterior à data de início.");
  return;
}
```

Isso permite `dataFim === dataInicio`, que o banco vai recusar. Trocar para `dataFim <= dataInicio`.

### 🟢 Bem coberto: enums de situação

`SituacaoAluno`, `SituacaoMatricula`, `SituacaoProfessor`, `SituacaoPeriodo` batem exatamente com os respectivos `CHECK (... IN (...))` do SQL — inclusive as strings sem acento (`"Concluida"`, não `"Concluída"`) foram respeitadas corretamente, que é um erro comum nesse tipo de espelhamento.

### 🟡 Unicidade nunca validada no client

`numero_matricula`, `cpf_aluno`, `codigo_inep`, `cnpj`, `cpf_prof`, `cpf_resp` e `nome_materia` são todos `UNIQUE` no banco, mas nenhum formulário do front checa duplicidade antes de salvar — hoje um "Cadastrar" duplicado só falharia (de novo) na integração real. Não é bloqueante para o estágio atual, mas é uma classe inteira de validação que ainda não existe em nenhum dos 8 módulos já construídos.

---

## 3. Estrutura de Componentes

### O padrão atual (1 pasta por tabela "de cadastro") funciona bem até aqui

```
src/components/<entidade>/{Card,Lista,Formulario}<Entidade>.tsx
src/pages/Pagina<Entidade>.tsx
```

Esse mapeamento 1:1 com `escola`, `aluno`, `turma`, `matricula`, `professor`, `materia`, `periodo`, `responsavel` é direto e consistente — e essas são exatamente as tabelas "de cadastro" do schema (têm PK própria e um formulário natural de criar/editar um registro por vez). Para essa fatia do banco, a estrutura está correta e não precisa mudar.

Onde esse padrão **não vai se sustentar sozinho** quando o build chegar nas tabelas que faltam:

**a) Tabelas de junção não têm uma "lista" natural própria**

`alunoresponsavel` e `grade_curricular` não são entidades que alguém navega numa lista solta (`/alunoresponsavel`, ningúem pensa assim) — são *relações dentro do contexto de outra entidade*. Faz mais sentido como uma seção/painel dentro da tela do aluno ("Responsáveis vinculados") e da turma ("Grade curricular da turma"), possivelmente em um modal, do que como um módulo `Card/Lista/Formulario` de primeira classe com rota própria. Vale decidir isso *antes* de começar esses dois, porque copiar o template dos módulos anteriores aqui geraria uma tela sem uso real (uma "lista de todos os pares aluno-responsável do sistema" não é uma necessidade de UX).

**b) `nota` / `frequencia` são inerentemente uma grade (matriz aluno × avaliação/data), não uma lista de cards**

O padrão "zero `<table>`, tudo Card" funciona muito bem para as 8 entidades já construídas (cada card = 1 registro completo e autocontido). Mas lançar nota ou frequência é, por natureza, uma operação em lote sobre *todos os alunos de uma turma* ao mesmo tempo — a UI mais usável ali é uma grade densa (aluno nas linhas, avaliação/data nas colunas), que é exatamente o formato que o `<table>` existe para resolver bem. Vale já sinalizar isso como uma exceção deliberada e documentada à regra "sem tabelas", em vez de forçar um card por (aluno × avaliação) — o que geraria uma lista enorme e pouco usável.

**c) `boletim` e `boleto` continuam se encaixando bem no padrão Card**

Essas duas seguem sendo "1 registro, 1 card" (boletim = 1 média fechada, boleto = 1 cobrança) — dá pra seguir exatamente o molde do `Materia`/`Periodo` quando chegar a vez delas. `boleto` provavelmente vai precisar de um badge de situação com 4 cores (`Pendente`/`Pago`/`Atrasado`/`Cancelado`) — dá pra estender o mesmo padrão de `selo-situacao--<variante>` já usado em `Matricula`, `Periodo` e `Professor`.

**d) As 3 views já têm um lar natural: o `Dashboard`**

`vw_aluno_escola_atual`, `vw_aluno_responsavel_financeiro` e `vw_aluno_media_dinamica` são dados derivados/agregados, não CRUD — e o `Dashboard.tsx` já existe exatamente para esse tipo de leitura cruzada entre entidades (hoje ele já calcula ocupação de turma e distribuição por turno cruzando `turmas`+`matriculas`). Quando essas views virarem endpoints reais, elas alimentam KPIs/gráficos novos no Dashboard existente, não uma página nova — a arquitetura atual já está pronta pra isso.

### Identidade visual

Azul institucional (`#1e3a8a`) em ações primárias e vermelho (`#dc2626`) reservado só para excluir estão aplicados de forma consistente em todos os módulos já construídos (confirmado nas revisões anteriores). Isso não tem correspondência direta no SQL, claro, mas é o único ponto do padrão visual que precisa de atenção quando `boleto` for construído: as 4 situações de cobrança pedem uma leitura de urgência mais forte do que as badges atuais (ex.: `Atrasado` provavelmente merece vermelho/laranja de alerta, não o cinza neutro usado hoje em `Periodo Encerrado` ou `Professor Inativo`).

---

## Próximos passos sugeridos, em ordem

1. Corrigir a nullability de `Professor`/`Responsavel` (rápido, sem risco).
2. Decidir e aplicar a convenção única de CPF/CNPJ (dígitos puros + máscara só na UI).
3. Criar o tipo `AlunoResponsavel` e a validação client-side do responsável financeiro único — é o gap que mais te expõe a um bug de regra de negócio "invisível" até a integração real.
4. Adicionar a mesma validação client-side para matrícula ativa única.
5. Corrigir o off-by-one de `FormularioPeriodo` (`<=` em vez de `<`).
6. Só depois disso, seguir para `alunoresponsavel`/`grade_curricular`/`avaliacao`/`nota`/`frequencia`/`boletim`/`boleto` — com o design de tela decidido caso a caso (painel embutido vs. módulo próprio vs. grade), não copiando automaticamente o template `Card/Lista/Formulario`.
