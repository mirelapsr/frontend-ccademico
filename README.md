# 🏫 Portal de Gestão Escolar - Front-end

Este é o front-end de um sistema de Controle Acadêmico, focado em escalabilidade e interfaces institucionais limpas. Nesta nova versão, o projeto recebeu uma **arquitetura de roteamento profissional**, permitindo a navegação modular entre diferentes seções do sistema (como Dashboard, Escolas e, futuramente, Alunos) através de um menu lateral fixo.

## 🛠️ Tecnologias Utilizadas

* **React** - Biblioteca para construção das interfaces.
* **TypeScript** - Tipagem estática rigorosa para garantir a integridade dos dados e o contrato com o back-end (camelCase).
* **Vite** - Ferramenta de build rápida e servidor de desenvolvimento.
* **React Router DOM** - Biblioteca de roteamento para navegação Single Page Application (SPA).
* **CSS** - Estilização de componentes, layout flexível e responsividade.

## 🚀 Como Executar o Projeto Localmente

1. Certifique-se de ter o Node.js instalado em sua máquina.
2. Abra o terminal na raiz do projeto (onde está o arquivo `package.json`).
3. Instale as dependências (incluindo o novo pacote de rotas):
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse o link verde gerado no terminal (geralmente `http://localhost:5173/`) no seu navegador.

## ✨ Funcionalidades Atuais

* **Navegação Modular:** Sistema de rotas dinâmicas alternando o conteúdo principal sem recarregar a página.
* **Layout Estrutural (Sidebar):** Menu lateral fixo acompanhando o usuário em todas as telas.
* **Gestão de Escolas (Mock CRUD):** 
  * Listagem em tabela inteligente.
  * Criação e Edição (com conversão e validação de dados nulos/opcionais).
  * Exclusão segura (com `window.confirm`).
* **Isolamento de Estado:** Cada página gerencia seu próprio estado, aliviando o componente raiz (`App.tsx`).

## 🗺️ Próximos Passos

* Clonagem da arquitetura para a criação do CRUD de **Alunos**.
* Construção visual da tela inicial (Dashboard) com indicadores reais.
* Substituição do `mock.ts` pelas chamadas reais da API consumindo o back-end.