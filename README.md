# Controle de Gastos Residenciais

Aplicação composta por uma **Web API em .NET 10** (backend) e um **frontend React + TypeScript** (frontend) para controle de despesas e receitas.

---

## Iniciando (do zero)

### 1) Clonar o repositório

```bash
git clone https://github.com/thiagoduutra/teste-tecnico.git
cd teste_tecnico
```

### 2) Rodar a Web API (.NET)

A API usa SQLite e cria automaticamente o arquivo `controle_gastos.db` na primeira execução.

```bash
cd WebAPIGastos/WebAPIGastos
dotnet run --launch-profile https
```

> A API ficará disponível em `https://localhost:7214` (ou porta similar).

### 3) Rodar o frontend (React + Vite)

```bash
cd ../../../front
npm i
npm run dev
```

> O frontend normalmente fica em `http://localhost:5173` e faz chamadas para a API.

---

## Estrutura do repositório

- `front/` – frontend React + TypeScript
- `WebAPIGastos/` – backend ASP.NET Core Web API (SQLite)

---

## Regras de negócio (backend)

Ao criar uma transação, a API valida:

- A descrição é obrigatória
- O valor deve ser maior que zero
- A pessoa informada deve existir
- A categoria informada deve existir
- Menores de idade só podem possuir transações do tipo **despesa**
- Categoria de receita não pode ser usada em transação de **despesa**
- Categoria de despesa não pode ser usada em transação de **receita**
- Categoria com finalidade **Ambas** pode ser usada em qualquer tipo

---

## Tecnologias utilizadas

### Front-end
- React
- TypeScript
- Vite
- Bootstrap
- Axios

### Back-end
- .NET 10
- ASP.NET Core Web API
- Dapper
- SQLite

---

## Limpeza (opcional)

Para resetar o banco de dados, pare a API e remova:

```powershell
rm WebAPIGastos/WebAPIGastos/controle_gastos.db
```

Depois, execute a API novamente para recriar o banco.
