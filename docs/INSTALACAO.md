# Instalação — tudo que este projeto precisa para rodar

Tutorial do zero até o portal aberto no navegador. Se você seguir na ordem, em
uns 20 minutos está rodando (a maior parte é download).

> Este guia é **específico deste trabalho** (um projeto React + Vite). Ele não é
> o guia geral do Módulo II — aqui não há Live Server nem HTML solto.

## O que você vai instalar

| O que | Para que serve | Obrigatório? |
|---|---|---|
| **Node.js 20.19+** (use a **LTS**) e o **npm** | é o motor que roda o Vite, o servidor de desenvolvimento e o TypeScript | **sim** |
| **Git** | baixar o projeto e salvar seu progresso | **sim** |
| Conta no **GitHub** | criar o *seu* repositório e entregar o trabalho | **sim** |
| **VS Code** + 2 extensões | escrever o código com autocomplete e erros na hora | fortemente recomendado |
| **Navegador** com DevTools | ver a página e depurar (F12) | **sim** (você já tem) |

### O que você **não** precisa

- ❌ **Python, PostgreSQL, `uvicorn`** — nada do Módulo I. Este é só o frontend.
- ❌ **A API rodando.** Os dados vêm do arquivo `src/mock.ts`, que você preenche.
  A integração com a API é assunto do **Módulo III**.
- ❌ **Bootstrap, Tailwind ou qualquer framework CSS.** O CSS é puro, de
  propósito.
- ❌ **Instalar o React ou o Vite "na máquina".** Eles vêm dentro do projeto,
  pelo `npm install`.

### Onde instalar: WSL ou Windows?

Os dois funcionam. Se você fez o Módulo I no **WSL (Ubuntu)**, continue nele —
os comandos são os mesmos do backend. Se preferir o **Windows nativo**, também
serve. **Escolha um e siga até o fim**, sem misturar.

> ⚠️ **No WSL, trabalhe dentro do Linux.** Clone o projeto na sua pasta
> pessoal (`~/projetos`), **não** em `/mnt/c/...`. O `npm install` em pasta do
> Windows montada no Linux fica muito lento e às vezes falha.

---

## Parte 1 — Git e conta no GitHub

### 1.1. Instalar o Git

**WSL / Ubuntu** (provavelmente já tem, do Módulo I):

```bash
sudo apt update && sudo apt install -y git
```

**Windows:** baixe em <https://git-scm.com/download/win> e instale com as
opções padrão.

Confira:

```bash
git --version      # ex.: git version 2.43.0
```

### 1.2. Dizer ao Git quem você é

Só na primeira vez, em qualquer terminal:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### 1.3. Conta no GitHub

Crie (ou use a sua) em <https://github.com>. Você vai precisar dela para gerar o
seu repositório a partir do template e para entregar o trabalho.

> **Ao dar `git push`, o GitHub vai pedir senha — e não aceita a sua senha
> normal.** Use um **token**: <https://github.com/settings/tokens> → *Generate
> new token (classic)* → marque o escopo **repo** → copie o token e use-o **no
> lugar da senha**. (Alternativa: configurar chave SSH.)

---

## Parte 2 — Node.js e npm

O **Node.js** roda o Vite (o servidor de desenvolvimento) e o TypeScript. O
**npm** vem junto e baixa as bibliotecas.

Este projeto exige **Node 20.19 ou mais novo** (o Vite 8 não roda em versões
anteriores). Recomendado: a versão **LTS** atual (24.x).

### Caminho A — WSL / Ubuntu (com nvm)

O **nvm** instala o Node sem `sudo` e deixa você trocar de versão:

```bash
# 1. Instalar o nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# 2. Recarregar o terminal (ou feche e abra de novo)
source ~/.bashrc

# 3. Instalar e ativar o Node LTS
nvm install --lts
nvm use --lts
```

> ⚠️ **Não** instale o Node com `apt install nodejs`: a versão do repositório do
> Ubuntu costuma ser velha demais para o Vite 8.

### Caminho B — Windows nativo

1. Baixe o instalador **LTS** em <https://nodejs.org>.
2. Execute e avance com as opções padrão.
3. **Feche e reabra** o terminal (senão o `node` não é reconhecido).

### Conferir

```bash
node -v      # precisa ser v20.19+ (ex.: v24.18.0)
npm -v       # ex.: 11.16.0
```

Se `node -v` mostrar algo como `v18.x`, atualize antes de continuar — no WSL,
`nvm install --lts && nvm use --lts`.

---

## Parte 3 — VS Code e extensões

### 3.1. Instalar

Baixe em <https://code.visualstudio.com> e instale. Se você fez o Módulo I,
já tem.

> **Usando WSL?** Instale o VS Code no **Windows** e adicione a extensão **WSL**
> (da Microsoft). Depois, no terminal do Ubuntu, abra o projeto com `code .` —
> ele conecta no Linux sozinho.

### 3.2. Extensões

`Ctrl + Shift + X` e instale:

| Extensão | Para que serve |
|---|---|
| **ESLint** (Microsoft) | aponta erros e maus hábitos no TypeScript/React enquanto você digita |
| **Prettier — Code formatter** | formata o código ao salvar (indentação, aspas, ponto e vírgula) |

Opcional, mas ajuda: **ES7+ React/Redux snippets** (atalhos para componentes).

> **Live Server não é usado aqui.** Quem serve a página é o `npm run dev`. Se
> você abrir o `index.html` com o Live Server, vai ver uma página em branco — é
> esperado, porque quem monta a tela é o React.

### 3.3. Formatar ao salvar (opcional, recomendado)

`Ctrl + Shift + P` → *"Preferences: Open User Settings (JSON)"* e acrescente:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

---

## Parte 4 — Navegador e DevTools

Use **Chrome**, **Edge** ou **Firefox** atualizado. Você vai usar três coisas
do DevTools (**F12**) durante o trabalho:

| Aba | Para que |
|---|---|
| **Console** | ver erros de JavaScript e os avisos de `key` do React. Tela branca? O motivo está aqui. |
| **Elements** | inspecionar o HTML que o React gerou e testar CSS na hora |
| **Modo dispositivo** (`Ctrl + Shift + M`) | conferir a responsividade — é o que a rubrica avalia |

---

## Parte 5 — Pegar o projeto e rodar

### 5.1. Criar o SEU repositório

Na página deste template no GitHub: **"Use this template" → "Create a new
repository"**. Dê um nome e crie. Agora o repositório é seu.

### 5.2. Clonar e instalar

No terminal (no WSL, dentro da sua pasta pessoal — nunca em `/mnt/c`):

```bash
# 1. Baixar o SEU repositório (troque a URL pela sua)
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
cd SEU-REPOSITORIO

# 2. Instalar as dependências do projeto (uma vez só)
npm install
```

O `npm install` baixa ~70 MB e cria a pasta `node_modules/`. Precisa de
internet e demora de 30 s a alguns minutos. Avisos amarelos de `deprecated` são
normais; o que importa é não haver **erro** no fim.

> A pasta `node_modules/` **não** vai para o Git (já está no `.gitignore`). Ela
> é recriada com `npm install` em qualquer máquina.

### 5.3. Subir o projeto

```bash
npm run dev
```

Saída parecida com:

```
  VITE v8.2.1  ready in 187 ms
  ➜  Local:   http://localhost:5173/
```

Abra esse endereço (`Ctrl + clique` no link costuma funcionar). Deve aparecer a
página provisória do portal, com as instruções iniciais. ✅

**Deixe esse comando rodando** enquanto trabalha: a cada arquivo salvo, o
navegador atualiza sozinho. Para parar, `Ctrl + C` no terminal.

### 5.4. Conferir que o build passa

Em outro terminal (ou depois de parar o `dev`):

```bash
npm run build
```

Ele roda o TypeScript e gera a versão de produção. **Este comando precisa
passar** — é critério de aceitação do trabalho.

### 5.5. Abrir no VS Code

```bash
code .
```

Comece pelo `docs/COMECE_AQUI.md`.

---

## Parte 6 — Checklist final

- [ ] `git --version` responde
- [ ] `node -v` mostra **v20.19 ou mais novo**
- [ ] `npm -v` responde
- [ ] Criei meu repositório a partir do template e clonei
- [ ] `npm install` terminou **sem erro**
- [ ] `npm run dev` abre a página provisória em `http://localhost:5173`
- [ ] `npm run build` passa
- [ ] O DevTools abre com **F12** e o Console está sem erros
- [ ] O VS Code abre a pasta com ESLint e Prettier instalados

Fechou tudo? Vá para o [COMECE_AQUI.md](COMECE_AQUI.md).

---

## Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| `node: command not found` / "não é reconhecido" | terminal aberto antes da instalação | feche e reabra o terminal. No WSL: `source ~/.bashrc` |
| `nvm: command not found` | o nvm não foi carregado | `source ~/.bashrc` ou reabra o terminal |
| `vite: not found` ao rodar `npm run dev` | faltou o `npm install` | rode `npm install` na pasta do projeto |
| Erro citando `Vite requires Node.js version 20.19+` | Node velho | `nvm install --lts && nvm use --lts` (WSL) ou reinstale a LTS (Windows) |
| `npm error ENOENT ... package.json` | você está na pasta errada | `cd` para a pasta do projeto (a que tem o `package.json`) |
| `EACCES: permission denied` no `npm install` | Node instalado com `sudo` | use o **nvm** (Caminho A) e não use `sudo npm` |
| `npm install` travado/lentíssimo (WSL) | projeto em `/mnt/c/...` | clone dentro do Linux (`~/projetos`) |
| Porta 5173 já em uso | outro `npm run dev` aberto | feche o outro terminal, ou aceite a porta que o Vite sugerir |
| Página **em branco** e nada no terminal | erro de JavaScript | abra o **Console** (F12) — a mensagem está lá |
| `localhost` não abre (WSL) | endereço errado | use exatamente a URL que o Vite imprimiu; se não abrir, tente `http://127.0.0.1:5173` |
| Página em branco ao abrir o `index.html` direto (ou com Live Server) | o React precisa do servidor | use sempre `npm run dev` |
| Salvei e o navegador não atualizou | `npm run dev` foi encerrado | confira o terminal; rode de novo |
| `Support for the experimental syntax 'jsx' isn't enabled` | arquivo com JSX salvo como `.ts` | renomeie para **`.tsx`** |
| `git push` pede senha e recusa a certa | GitHub não aceita senha | use um **token** no lugar da senha (Parte 1.3) |
| `git status` mostra milhares de arquivos | `node_modules/` sendo versionado | confirme que o `.gitignore` existe e não foi alterado |
| Acentos quebrados na tela | falta `<meta charset="UTF-8">` | já vem no `index.html`; não o remova |

---

## Comandos do dia a dia (cole na parede)

```bash
npm install        # só na primeira vez, ou quando o package.json mudar
npm run dev        # sobe o servidor (deixe rodando; Ctrl + C para parar)
npm run build      # confere os tipos e gera a versão de produção
npm run preview    # serve a versão de produção, para ver como ficou

git add .
git commit -m "Descreve o que você fez"
git push
```
