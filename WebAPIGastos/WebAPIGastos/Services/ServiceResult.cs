namespace WebAPIGastos.Services
{
    public class ServiceResult<T>
    {
        public bool Sucesso { get; set; }
        public string Mensagem { get; set; } = string.Empty;
        public T? Dados { get; set; }
        public List<string> Erros { get; set; } = new();
        public static ServiceResult<T> Ok(T dados, string mensagem = "")
        {
            return new ServiceResult<T>
            {
                Sucesso = true,
                Mensagem = mensagem,
                Dados = dados
            };
        }

        public static ServiceResult<T> Falha(string mensagem)
        {
            return new ServiceResult<T>
            {
                Sucesso = false,
                Mensagem = mensagem,
                Dados = default
            };
        }
    }
}