using System.ComponentModel.DataAnnotations;
using WebAPIGastos.Enums;

namespace WebAPIGastos.Dtos.Categoria
{
    public class CategoriaCriarDto
    {
        [Required(ErrorMessage = "Descrição obrigatória.")]
        [MaxLength(400, ErrorMessage = "A descrição deve ter no máximo 400 caracteres.")]
        public string Descricao { get; set; } = string.Empty;

        [EnumDataType(typeof(FinalidadeCategoria), ErrorMessage = "Finalidade inválida.")]
        public FinalidadeCategoria Finalidade { get; set; }
    }
}
