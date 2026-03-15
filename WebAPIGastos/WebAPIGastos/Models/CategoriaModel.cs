using WebAPIGastos.Enums;

namespace WebAPIGastos.Models
{
    public class CategoriaModel
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public FinalidadeCategoria Finalidade { get; set; }
    }
}
