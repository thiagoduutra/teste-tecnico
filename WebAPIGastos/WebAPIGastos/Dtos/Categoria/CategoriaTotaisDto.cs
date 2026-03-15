namespace WebAPIGastos.Dtos.Categoria
{
    public class CategoriaTotaisDto
    {
            public int CategoriaId { get; set; }
            public string Descricao { get; set; } = string.Empty;
            public decimal TotalReceitas { get; set; }
            public decimal TotalDespesas { get; set; }
            public decimal Saldo { get; set; }
    }
}
