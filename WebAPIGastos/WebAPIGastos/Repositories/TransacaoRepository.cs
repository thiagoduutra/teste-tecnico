using Dapper;
using Microsoft.AspNetCore.Connections;
using WebAPIGastos.Data;
using WebAPIGastos.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace WebAPIGastos.Repositories
{
    public class TransacaoRepository
    {
        private readonly DbConnectionFactory _connectionTrans;

        public TransacaoRepository(DbConnectionFactory connectionTrans)
        {
            _connectionTrans = connectionTrans;
        }
        public async Task<IEnumerable<TransacaoModel>> ListarAsync()
        {
            using var connection = _connectionTrans.CreateConnection();

            var sql = @"SELECT Id, Descricao, CAST(Valor AS REAL) AS Valor, Tipo, CategoriaId, PessoaId FROM Transacoes ORDER BY Id DESC;";

            var data = await connection.QueryAsync<TransacaoModel>(sql);
            return data;
        }

        public async Task<int> CriarAsync(TransacaoModel transacao)
        {
            using var connection = _connectionTrans.CreateConnection();

            var sql = @"INSERT INTO Transacoes (Descricao, Valor, Tipo, CategoriaId, PessoaId)
                        VALUES (@Descricao, @Valor, @Tipo, @CategoriaId, @PessoaId);
                        SELECT last_insert_rowid();";

            return await connection.ExecuteScalarAsync<int>(sql, transacao);
        }
    }
}
