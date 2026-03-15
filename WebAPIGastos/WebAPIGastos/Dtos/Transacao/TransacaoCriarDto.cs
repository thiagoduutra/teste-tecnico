using System.ComponentModel.DataAnnotations;
using WebAPIGastos.Enums;

namespace WebAPIGastos.Dtos.Transacao
{
    public class TransacaoCriarDto
    {
        [Required(ErrorMessage = "Descrição obrigatória.")]
        [MaxLength(400, ErrorMessage = "A descrição deve ter no máximo 400 caracteres.")]
        public string Descricao { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero.")]
        public decimal Valor { get; set; }

        [EnumDataType(typeof(TipoTransacao), ErrorMessage = "Tipo da transação é obrigatório.")]
        public TipoTransacao Tipo { get; set; }

        [Required(ErrorMessage = "Categoria é obrigatória.")]
        public int CategoriaId { get; set; }

        [Required(ErrorMessage = "Pessoa é obrigatória.")]
        public int PessoaId { get; set; }
    }
}
