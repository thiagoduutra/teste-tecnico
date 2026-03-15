using Dapper;
using WebAPIGastos.Data;
using WebAPIGastos.Dtos.Pessoa;
using WebAPIGastos.Models;

namespace WebAPIGastos.Repositories;

public class PessoaRepository
{
    private readonly DbConnectionFactory _connectionTrans;

    public PessoaRepository(DbConnectionFactory connectionTrans)
    {
        _connectionTrans = connectionTrans;
    }

    public async Task<IEnumerable<PessoaModel>> ListarAsync()
    {
        using var connection = _connectionTrans.CreateConnection();

        var SQL = "SELECT Id, Nome, Idade FROM Pessoas ORDER BY Nome";
        return await connection.QueryAsync<PessoaModel>(SQL);
    }

    public async Task<IEnumerable<PessoaTotaisDto>> ListarTotaisAsync()
    {
        using var connection = _connectionTrans.CreateConnection();

        var SQL = @"
            SELECT
                P.Id AS PessoaId,
                P.Nome,
                CAST(COALESCE(SUM(CASE WHEN T.Tipo = 2 THEN T.Valor ELSE 0 END), 0) AS REAL) AS TotalReceitas,
                CAST(COALESCE(SUM(CASE WHEN T.Tipo = 1 THEN T.Valor ELSE 0 END), 0) AS REAL) AS TotalDespesas,
                CAST(COALESCE(SUM(CASE WHEN T.Tipo = 2 THEN T.Valor ELSE 0 END), 0)
                    - COALESCE(SUM(CASE WHEN T.Tipo = 1 THEN T.Valor ELSE 0 END), 0) AS REAL) AS Saldo
            FROM Pessoas P
            LEFT JOIN Transacoes T ON T.PessoaId = P.Id
            GROUP BY P.Id, P.Nome
            ORDER BY P.Nome;";

        var data = await connection.QueryAsync<PessoaTotaisDto>(SQL);
        return data;
    }

    public async Task<PessoaModel?> BuscarPorIdAsync(int pId)
    {
        using var connection = _connectionTrans.CreateConnection();

        return await connection.QueryFirstOrDefaultAsync<PessoaModel>(
            "SELECT Id, Nome, Idade FROM Pessoas WHERE Id = @Id",
            new { Id = pId });
    }

    public async Task<int> CriarAsync(PessoaModel pessoa)
    {
        using var connection = _connectionTrans.CreateConnection();

        var SQL = @"
            INSERT INTO Pessoas (Nome, Idade)
            VALUES (@Nome, @Idade);
            SELECT last_insert_rowid();";

        return await connection.ExecuteScalarAsync<int>(SQL, pessoa);
    }

    public async Task<int> AtualizarAsync(PessoaModel pessoa)
    {
        using var connection = _connectionTrans.CreateConnection();

        var SQL = @"
            UPDATE Pessoas
            SET Nome = @Nome,
                Idade = @Idade
            WHERE Id = @Id;";

        return await connection.ExecuteAsync(SQL, pessoa);
    }

    public async Task<int> ExcluirAsync(int id)
    {
        using var connection = _connectionTrans.CreateConnection();

        var SQL = "DELETE FROM Pessoas WHERE Id = @Id";
        return await connection.ExecuteAsync(SQL, new { Id = id });
    }
}
