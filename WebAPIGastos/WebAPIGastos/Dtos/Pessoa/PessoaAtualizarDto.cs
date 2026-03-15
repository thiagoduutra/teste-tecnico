using System.ComponentModel.DataAnnotations;

namespace WebAPIGastos.Dtos.Pessoa
{
    public class PessoaAtualizarDto
    {
        [Required(ErrorMessage = "O nome é obrigatório.")]
        [MaxLength(200, ErrorMessage = "O nome deve ter no máximo 200 caracteres.")]
        public string Nome { get; set; } = string.Empty;

        [Range(0, 150, ErrorMessage = "A idade deve estar entre 0 e 150.")]
        public int Idade { get; set; }
    }
}
