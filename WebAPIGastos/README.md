# Controle de Gastos Residenciais

API para gerenciamento de gastos residenciais, desenvolvida em ASP.NET Core com persistencia em SQLite. O projeto permite cadastrar pessoas, categorias e transacoes, alem de consultar totais consolidados por pessoa e por categoria.

## Objetivo

Centralizar o controle de receitas e despesas de um ambiente residencial com regras simples de negocio e estrutura organizada em camadas:

- `Controllers`: exposicao dos endpoints HTTP.
- `Services`: validacoes e regras de negocio.
- `Repositories`: acesso a dados com Dapper.
- `Data`: conexao e inicializacao do banco SQLite.
- `Dtos`, `Models` e `Enums`: contratos e representacoes do dominio.

## Stack utilizada

- .NET 10
- ASP.NET Core Web API
- Dapper
- SQLite
- Scalar/OpenAPI para documentacao da API em ambiente de desenvolvimento

## Estrutura do projeto

```text
WebAPIGastos/
|-- WebAPIGastos.slnx
|-- README.md
`-- WebAPIGastos/
    |-- Controllers/
    |-- Data/
    |-- Dtos/
    |-- Enums/
    |-- Models/
    |-- Repositories/
    |-- Services/
    |-- Properties/
    |-- appsettings.json
    `-- controle_gastos.db
```

## Como executar o projeto

### Pre-requisitos

- SDK do .NET 10 instalado

### Passos

1. Acesse a pasta da API:

```powershell
cd .\WebAPIGastos
```

2. Restaure as dependencias:

```powershell
dotnet restore
```

3. Execute a aplicacao:

```powershell
dotnet run
```

### URLs locais

Conforme o `launchSettings.json`, a API sobe em desenvolvimento nos enderecos:

- `http://localhost:5229`
- `https://localhost:7185`

### Documentacao interativa

Em ambiente de desenvolvimento, a API expoe OpenAPI + Scalar:

- OpenAPI JSON: `http://localhost:5229/openapi/v1.json`
- Scalar UI: `http://localhost:5229/scalar/v1`

Se estiver usando HTTPS, troque a porta para `7185`.

## Banco de dados

O projeto usa SQLite com a connection string abaixo:

```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=controle_gastos.db;Foreign Keys=True"
}
```

O arquivo `controle_gastos.db` fica dentro da pasta do projeto da API. As tabelas sao criadas automaticamente na inicializacao da aplicacao:

- `Pessoas`
- `Categorias`
- `Transacoes`

### Relacionamentos

- Cada transacao pertence a uma pessoa.
- Cada transacao pertence a uma categoria.
- Ao excluir uma pessoa, suas transacoes vinculadas sao removidas por `ON DELETE CASCADE`.

## CORS

Existe uma politica chamada `front` permitindo chamadas a partir de:

- `http://localhost:5173`

Isso indica integracao prevista com um front-end local, provavelmente em Vite.

## Endpoints principais

Base URL: `http://localhost:5229/api`

### Pessoas

- `GET /Pessoa`: lista todas as pessoas.
- `GET /Pessoa/{id}`: busca uma pessoa por identificador.
- `POST /Pessoa`: cria uma nova pessoa.
- `PUT /Pessoa/{id}`: atualiza uma pessoa existente.
- `DELETE /Pessoa/{id}`: exclui uma pessoa.
- `GET /Pessoa/totais`: retorna totais por pessoa e consolidado geral.

Exemplo de payload para criar pessoa:

```json
{
  "nome": "Maria",
  "idade": 35
}
```

### Categorias

- `GET /Categoria`: lista categorias.
- `GET /Categoria/{id}`: busca uma categoria por identificador.
- `POST /Categoria`: cria uma categoria.
- `GET /Categoria/totais`: retorna totais por categoria e consolidado geral.

Exemplo de payload para criar categoria:

```json
{
  "descricao": "Supermercado",
  "finalidade": 1
}
```

Valores do enum `FinalidadeCategoria`:

- `1 = Despesa`
- `2 = Receita`
- `3 = Ambas`

### Transacoes

- `GET /Transacao`: lista transacoes cadastradas.
- `POST /Transacao`: cria uma nova transacao aplicando as regras de negocio.

Exemplo de payload para criar transacao:

```json
{
  "descricao": "Compra do mes",
  "valor": 350.75,
  "tipo": 1,
  "categoriaId": 1,
  "pessoaId": 1
}
```

Valores do enum `TipoTransacao`:

- `1 = Despesa`
- `2 = Receita`

## Regras de negocio implementadas

Ao criar uma transacao, a API valida:

- A descricao e obrigatoria.
- O valor deve ser maior que zero.
- A pessoa informada deve existir.
- A categoria informada deve existir.
- Menores de idade so podem possuir transacoes do tipo despesa.
- Categoria de receita nao pode ser usada em transacao de despesa.
- Categoria de despesa nao pode ser usada em transacao de receita.
- Categoria com finalidade `Ambas` pode ser usada nos dois tipos.

## Totais e consolidacoes

O projeto possui dois endpoints de agregacao:

- `GET /api/Pessoa/totais`
- `GET /api/Categoria/totais`

Ambos retornam:

- lista detalhada por entidade
- `totalReceitasGeral`
- `totalDespesasGeral`
- `saldoGeral`

## Validacoes de entrada

As DTOs aplicam validacoes com Data Annotations:

- nome de pessoa: obrigatorio, maximo de 200 caracteres
- idade: entre 0 e 150
- descricao de categoria/transacao: obrigatoria, maximo de 400 caracteres
- valor da transacao: maior que zero
- enums de tipo/finalidade: validos conforme o dominio

## Exemplo rapido de fluxo de uso

1. Criar uma pessoa em `POST /api/Pessoa`
2. Criar uma categoria em `POST /api/Categoria`
3. Criar uma transacao em `POST /api/Transacao`
4. Consultar consolidados em `GET /api/Pessoa/totais` e `GET /api/Categoria/totais`

## Observacoes

- O projeto atual contem apenas a API.
- O README anterior mencionava um front-end React, mas ele nao esta presente neste repositorio.
- Em desenvolvimento, a documentacao da API fica disponivel automaticamente via Scalar.
