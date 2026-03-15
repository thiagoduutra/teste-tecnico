# Controle de Gastos Residenciais - Front-end

Aplicacao React com TypeScript responsÁvel pela interface do sistema de controle de gastos residenciais.

## Visao geral

Este projeto contÉm a camada web do sistema e consome uma Web API em .NET.
O objetivo do front e permitir:

- cadastro e listagem de pessoas
- cadastro e listagem de categorias
- cadastro e listagem de transacoes
- consulta de totais por pessoa
- consulta de totais por categoria

## Estrutura do projeto

O codigo foi separado para facilitar manutencao e leitura:

- `src/pages`: telas principais
- `src/components`: componentes visuais reutilizaveis
- `src/services`: chamadas para a API
- `src/types`: contratos tipados do front
- `src/hooks`: logica reutilizavel de estado e carregamento
- `src/utils`: formatacao e tratamento auxiliar

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- Bootstrap
- Axios

## Pre-requisitos

Antes de executar o projeto, voce precisa ter:

- Node.js 20+ instalado
- npm instalado
- Web API do projeto rodando localmente

## Instalacao

Dentro da pasta `front`, execute:

- npm i 
- npm run dev

## API em producao

No ambiente local, o front usa `https://localhost:7185/api`.

Para publicar no GitHub Pages, defina a variavel `VITE_API_BASE_URL` com a URL publica da API:

- crie um arquivo `.env` local com base em `.env.example`; ou
- no GitHub, configure `Settings > Secrets and variables > Actions > Variables` com `VITE_API_BASE_URL`

Exemplo:

- `VITE_API_BASE_URL=https://sua-api-publica.exemplo.com/api`
