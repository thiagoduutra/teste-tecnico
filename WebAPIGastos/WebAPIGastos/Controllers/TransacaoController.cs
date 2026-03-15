using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPIGastos.Dtos.Transacao;
using WebAPIGastos.Repositories;
using WebAPIGastos.Services;

namespace WebAPIGastos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransacaoController : ControllerBase
    {
        private readonly TransacaoRepository _transacaoRepository;
        private readonly TransacaoService _transacaoService;

        public TransacaoController(TransacaoRepository transacaoRepository, TransacaoService transacaoService)
        {
            _transacaoRepository = transacaoRepository;
            _transacaoService = transacaoService;
        }

        /// <summary>
        /// Lista todas as transações cadastradas.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var transacoes = await _transacaoRepository.ListarAsync();
            return Ok(transacoes);
        }

        /// <summary>
        /// Cria uma nova transação aplicando as regras de negócio.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] TransacaoCriarDto dto)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            var resultado = await _transacaoService.CriarAsync(dto);

            if (!resultado.Sucesso)
                return BadRequest(new { mensagem = resultado.Mensagem });

            return Created(string.Empty, new
            {
                mensagem = resultado.Mensagem,
                transacao = resultado.Dados
            });
        }
    }
}
