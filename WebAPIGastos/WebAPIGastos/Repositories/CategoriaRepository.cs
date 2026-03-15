using Dapper;
using Microsoft.AspNetCore.Connections;
using WebAPIGastos.Data;
using WebAPIGastos.Dtos.Categoria;
using WebAPIGastos.Models;

namespace WebAPIGastos.Repositories
{
    public class CategoriaRepository
    {
        private readonly DbConnectionFactory _connectionTrans;

        public CategoriaRepository(DbConnectionFactory connectionTrans)
        {
            _connectionTrans = connectionTrans;
        }
        public async Task<IEnumerable<CategoriaModel>> ListarAsync()
        {
            using var connection = _connectionTrans.CreateConnection();

            var SQL = @"SELECT Id, Descricao, Finalidade FROM Categorias ORDER BY Descricao;";

            return await connection.QueryAsync<CategoriaModel>(SQL);
        }

        public async Task<CategoriaModel?> BuscarPorIdAsync(int id)
        {
            using var connection = _connectionTrans.CreateConnection();

            var SQL = @"SELECT Id, Descricao, Finalidade FROM Categorias WHERE Id = @Id;";

            return await connection.QueryFirstOrDefaultAsync<CategoriaModel>(SQL, new { Id = id });
        }

        public async Task<int> CriarAsync(CategoriaModel categoria)
        {
            using var connection = _connectionTrans.CreateConnection();

            var SQL = @"INSERT INTO Categorias (Descricao, Finalidade)
                      VALUES (@Descricao, @Finalidade);
                      SELECT last_insert_rowid();";

            return await connection.ExecuteScalarAsync<int>(SQL, categoria);
        }
        public async Task<IEnumerable<CategoriaTotaisDto>> ListarTotaisAsync()
        {
            using var connection = _connectionTrans.CreateConnection();

            var sql = @"
                    SELECT
                        C.Id AS CategoriaId,
                        C.Descricao,
                        CAST(COALESCE(SUM(CASE WHEN T.Tipo = 2 THEN T.Valor ELSE 0 END), 0) AS REAL) AS TotalReceitas,
                        CAST(COALESCE(SUM(CASE WHEN T.Tipo = 1 THEN T.Valor ELSE 0 END), 0) AS REAL) AS TotalDespesas,
                        CAST(
                            COALESCE(SUM(CASE WHEN T.Tipo = 2 THEN T.Valor ELSE 0 END), 0)
                            - COALESCE(SUM(CASE WHEN T.Tipo = 1 THEN T.Valor ELSE 0 END), 0)
                        AS REAL) AS Saldo
                    FROM Categorias C
                    LEFT JOIN Transacoes T ON T.CategoriaId = C.Id
                    GROUP BY C.Id, C.Descricao
                    ORDER BY C.Descricao;";

            var data = await connection.QueryAsync<CategoriaTotaisDto>(sql);
            return data;
        }

    }
}
