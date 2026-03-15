using Dapper;

namespace WebAPIGastos.Data
{
    public class DatabaseInitializer
    {
        public static void Initialize(DbConnectionFactory factory)
        {
            using var connection = factory.CreateConnection();

            var SQL = @"PRAGMA foreign_keys = ON;

                    CREATE TABLE IF NOT EXISTS Pessoas (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Nome TEXT NOT NULL,
                    Idade INTEGER NOT NULL
                );

                CREATE TABLE IF NOT EXISTS Categorias (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Descricao TEXT NOT NULL,
                    Finalidade INTEGER NOT NULL
                );

                CREATE TABLE IF NOT EXISTS Transacoes (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Descricao TEXT NOT NULL,
                    Valor NUMERIC NOT NULL,
                    Tipo INTEGER NOT NULL,
                    CategoriaId INTEGER NOT NULL,
                    PessoaId INTEGER NOT NULL,
                    FOREIGN KEY (CategoriaId) REFERENCES Categorias(Id),
                    FOREIGN KEY (PessoaId) REFERENCES Pessoas(Id) ON DELETE CASCADE
                );";

            connection.Execute(SQL);
        }
    }
}
