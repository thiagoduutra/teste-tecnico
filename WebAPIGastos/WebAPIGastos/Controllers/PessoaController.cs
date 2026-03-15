using Microsoft.AspNetCore.Mvc;
using WebAPIGastos.Dtos.Pessoa;
using WebAPIGastos.Models;
using WebAPIGastos.Repositories;
using WebAPIGastos.Services;

namespace WebAPIGastos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PessoaController : ControllerBase
    {
        private readonly PessoaRepository _pessoaRepository;
        private readonly PessoaService _pessoaService;

        public PessoaController(PessoaRepository pessoaRepository, PessoaService pessoaService)
        {
            _pessoaRepository = pessoaRepository;
            _pessoaService = pessoaService;

        }

        /// <summary>
        /// Lista todas as pessoas cadastradas.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var pessoas = await _pessoaRepository.ListarAsync();
            return Ok(pessoas);
        }

        /// <summary>
        /// Lista o total de receitas, despesas e saldo por pessoa
        /// </summary>
        [HttpGet("totais")]
        public async Task<IActionResult> ListarTotais()
        {
            var resultado = await _pessoaService.ListarTotaisAsync();

            if (!resultado.Sucesso)
                return BadRequest(new { mensagem = resultado.Mensagem });

            return Ok(new
            {
                sucesso = resultado.Sucesso,
                mensagem = resultado.Mensagem,
                dados = resultado.Dados
            });
        }

        /// <summary>
        /// Busca uma pessoa pelo identificador.
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> BuscarPorId(int id)
        {
            var pessoa = await _pessoaRepository.BuscarPorIdAsync(id);

            if (pessoa is null)
                return NotFound(new { mensagem = "Pessoa não encontrada." });

            return Ok(pessoa);
        }

        /// <summary>
        /// Cria uma nova pessoa.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] PessoaCriarDto dto)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            var pessoa = new PessoaModel
            {
                Nome = dto.Nome.Trim(),
                Idade = dto.Idade
            };

            var novoId = await _pessoaRepository.CriarAsync(pessoa);
            pessoa.Id = novoId;

            return CreatedAtAction(nameof(BuscarPorId), new { id = pessoa.Id }, pessoa);
        }

        /// <summary>
        /// Atualiza os dados de uma pessoa existente.
        /// </summary>
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Atualizar(int id, [FromBody] PessoaAtualizarDto dto)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            var pessoaExistente = await _pessoaRepository.BuscarPorIdAsync(id);

            if (pessoaExistente is null)
                return NotFound(new { mensagem = "Pessoa não encontrada." });

            pessoaExistente.Nome = dto.Nome.Trim();
            pessoaExistente.Idade = dto.Idade;

            await _pessoaRepository.AtualizarAsync(pessoaExistente);

            return Ok(new
            {
                mensagem = "Pessoa atualizada com sucesso.",
                pessoa = pessoaExistente
            });
        }

        /// <summary>
        /// Exclui uma pessoa e, por regra do banco, suas transações vinculadas.
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Excluir(int id)
        {
            var pessoaExistente = await _pessoaRepository.BuscarPorIdAsync(id);

            if (pessoaExistente is null)
                return NotFound(new { mensagem = "Pessoa não encontrada." });

            await _pessoaRepository.ExcluirAsync(id);

            return Ok(new { mensagem = "Pessoa excluída com sucesso." });
        }
    }
}
