export interface TotaisResumo {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface ResumoResponse<TItem> {
  itens: TItem[];
  totalGeral: TotaisResumo;
}

export interface PessoaResumo extends TotaisResumo {
  pessoaId: string;
  nome: string;
}

export interface CategoriaResumo extends TotaisResumo {
  categoriaId: string;
  descricao: string;
}
