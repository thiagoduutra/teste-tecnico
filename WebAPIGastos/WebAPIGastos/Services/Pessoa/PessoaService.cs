using WebAPIGastos.Dtos.Pessoa;
using WebAPIGastos.Repositories;

namespace WebAPIGastos.Services;

public class PessoaService
{
    private readonly PessoaRepository _pessoaRepository;

    public PessoaService(PessoaRepository pessoaRepository)
    {
        _pessoaRepository = pessoaRepository;
    }

    public async Task<ServiceResult<object>> ListarTotaisAsync()
    {
        var pessoas = (await _pessoaRepository.ListarTotaisAsync()).ToList();

        var dados = new
        {
            pessoas,
            totalReceitasGeral = pessoas.Sum(p => p.TotalReceitas),
            totalDespesasGeral = pessoas.Sum(p => p.TotalDespesas),
            saldoGeral = pessoas.Sum(p => p.Saldo)
        };

        return ServiceResult<object>.Ok(dados, "Totais por pessoa retornados com sucesso.");
    }
}