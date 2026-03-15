using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPIGastos.Dtos.Categoria;
using WebAPIGastos.Models;
using WebAPIGastos.Repositories;
using WebAPIGastos.Services;
using WebAPIGastos.Services.Categoria;

namespace WebAPIGastos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriaController : ControllerBase
    {
        private readonly CategoriaRepository _categoriaRepository;
        private readonly CategoriaService _categoriaService;

        public CategoriaController(CategoriaRepository categoriaRepository, CategoriaService categoriaService)
        {
            _categoriaRepository = categoriaRepository;
            _categoriaService = categoriaService;
        }

        /// <summary>
        /// Lista todas as categorias cadastradas.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var categorias = await _categoriaRepository.ListarAsync();
            return Ok(categorias);
        }

        /// <summary>
        /// Busca uma categoria pelo id.
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> BuscarPorId(int id)
        {
            var categoria = await _categoriaRepository.BuscarPorIdAsync(id);

            if (categoria is null)
                return NotFound(new { mensagem = "Categoria não encontrada." });

            return Ok(categoria);
        }

        /// <summary>
        /// Cria uma nova categoria.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] CategoriaCriarDto dto)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            if (string.IsNullOrWhiteSpace(dto.Descricao))
                return BadRequest(new { mensagem = "A descrição é obrigatória." });

            var categoria = new CategoriaModel
            {
                Descricao = dto.Descricao.Trim(),
                Finalidade = dto.Finalidade
            };

            var novoId = await _categoriaRepository.CriarAsync(categoria);
            categoria.Id = novoId;

            return CreatedAtAction(nameof(BuscarPorId), new { id = categoria.Id }, categoria);
        }

        /// <summary>
        /// Lista o total de receitas, despesas e saldo por categoria
        /// </summary>
        [HttpGet("totais")]
        public async Task<IActionResult> ListarTotais()
        {
            var resultado = await _categoriaService.ListarTotaisAsync();

            if (!resultado.Sucesso)
                return BadRequest(new { mensagem = resultado.Mensagem });

            return Ok(new
            {
                sucesso = resultado.Sucesso,
                mensagem = resultado.Mensagem,
                dados = resultado.Dados
            });
        }
    }
}
