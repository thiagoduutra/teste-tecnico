export type TipoTransacao = "despesa" | "receita";

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoriaId: string;
  categoriaDescricao?: string;
  pessoaId: string;
  pessoaNome?: string;
}

export interface TransacaoFormValues {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoriaId: string;
  pessoaId: string;
}
