using WebAPIGastos.Dtos;
using WebAPIGastos.Dtos.Transacao;
using WebAPIGastos.Enums;
using WebAPIGastos.Models;
using WebAPIGastos.Repositories;

namespace WebAPIGastos.Services;

public class TransacaoService
{
    private readonly TransacaoRepository _transacaoRepository;
    private readonly PessoaRepository _pessoaRepository;
    private readonly CategoriaRepository _categoriaRepository;

    public TransacaoService(TransacaoRepository transacaoRepository, PessoaRepository pessoaRepository, CategoriaRepository categoriaRepository)
    {
        _transacaoRepository = transacaoRepository;
        _pessoaRepository = pessoaRepository;
        _categoriaRepository = categoriaRepository;
    }

    /// <summary>
    /// Regras de Transação.
    /// </summary>
    public async Task<ServiceResult<TransacaoModel>> CriarAsync(TransacaoCriarDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Descricao))
            return ServiceResult<TransacaoModel>.Falha("A descrição é obrigatória.");

        if (dto.Valor <= 0)
            return ServiceResult<TransacaoModel>.Falha("O valor deve ser maior que zero.");

        var pessoa = await _pessoaRepository.BuscarPorIdAsync(dto.PessoaId);
        if (pessoa is null)
            return ServiceResult<TransacaoModel>.Falha("Pessoa não encontrada.");

        var categoria = await _categoriaRepository.BuscarPorIdAsync(dto.CategoriaId);
        if (categoria is null)
            return ServiceResult<TransacaoModel>.Falha("Categoria não encontrada.");

        // Regra: Menor de idade só pode ter despesa.
        if (pessoa.Idade < 18 && dto.Tipo == TipoTransacao.Receita)
            return ServiceResult<TransacaoModel>.Falha("Menores de idade só podem possuir despesas.");

        // Regra: Categoria deve ser compatível com o tipo da transação.
        if (dto.Tipo == TipoTransacao.Despesa &&
            categoria.Finalidade == FinalidadeCategoria.Receita)
        {
            return ServiceResult<TransacaoModel>.Falha("Categoria incompatível com transação do tipo despesa.");
        }

        if (dto.Tipo == TipoTransacao.Receita &&
            categoria.Finalidade == FinalidadeCategoria.Despesa)
        {
            return ServiceResult<TransacaoModel>.Falha("Categoria incompatível com transação do tipo receita.");
        }

        var transacao = new TransacaoModel
        {
            Descricao = dto.Descricao.Trim(),
            Valor = dto.Valor,
            Tipo = dto.Tipo,
            CategoriaId = dto.CategoriaId,
            PessoaId = dto.PessoaId
        };

        var novoId = await _transacaoRepository.CriarAsync(transacao);
        transacao.Id = novoId;

        return ServiceResult<TransacaoModel>.Ok(transacao, "Transação criada com sucesso.");
    }
}