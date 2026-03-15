using WebAPIGastos.Enums;

namespace WebAPIGastos.Models
{
    public class TransacaoModel
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }
        public int CategoriaId { get; set; }
        public int PessoaId { get; set; }
    }
}
