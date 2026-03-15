using WebAPIGastos.Repositories;

namespace WebAPIGastos.Services.Categoria
{
    public class CategoriaService
    {
        private readonly CategoriaRepository _categoriaRepository;

        public CategoriaService(CategoriaRepository categoriaRepository)
        {
            _categoriaRepository = categoriaRepository;
        }

        public async Task<ServiceResult<object>> ListarTotaisAsync()
        {
            var categorias = (await _categoriaRepository.ListarTotaisAsync()).ToList();

            var dados = new
            {
                categorias,
                totalReceitasGeral = categorias.Sum(p => p.TotalReceitas),
                totalDespesasGeral = categorias.Sum(p => p.TotalDespesas),
                saldoGeral = categorias.Sum(p => p.Saldo)
            };

            return ServiceResult<object>.Ok(dados, "Totais por categoria retornados com sucesso.");
        }
    }
}
