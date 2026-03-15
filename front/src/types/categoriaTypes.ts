export type FinalidadeCategoria = "despesa" | "receita" | "ambas";

export interface Categoria {
  id: string;
  descricao: string;
  finalidade: FinalidadeCategoria;
}

export interface CategoriaFormValues {
  descricao: string;
  finalidade: FinalidadeCategoria;
}
