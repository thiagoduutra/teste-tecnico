import api from "./api";
import type {
  Categoria,
  CategoriaFormValues,
  FinalidadeCategoria,
} from "../types/categoriaTypes";
import type { CategoriaResumo, ResumoResponse } from "../types/resumoTypes";

const resource = "/categoria";

type UnknownRecord = Record<string, unknown>;

const finalidadeParaApi: Record<FinalidadeCategoria, number> = {
  despesa: 1,
  receita: 2,
  ambas: 3,
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function getPropertyCaseInsensitive<TValue>(
  value: unknown,
  propertyNames: string[],
): TValue | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const normalizedPropertyNames = propertyNames.map((propertyName) =>
    propertyName.toLowerCase(),
  );

  const matchingKey = Object.keys(value).find((key) =>
    normalizedPropertyNames.includes(key.toLowerCase()),
  );

  if (!matchingKey) {
    return undefined;
  }

  return value[matchingKey] as TValue;
}

function unwrapResumoPayload(value: unknown): unknown {
  const directPayload = getPropertyCaseInsensitive<unknown>(value, [
    "data",
    "dados",
    "result",
    "resultado",
  ]);

  return directPayload ?? value;
}

function getNumericValue(value: unknown, propertyNames: string[]) {
  const result = getPropertyCaseInsensitive<number>(value, propertyNames);
  return typeof result === "number" ? result : 0;
}

function fromApiFinalidade(
  value: FinalidadeCategoria | number,
): FinalidadeCategoria {
  if (value === 1) {
    return "despesa";
  }

  if (value === 2) {
    return "receita";
  }

  if (value === 3) {
    return "ambas";
  }

  return value as FinalidadeCategoria;
}

function normalizeCategoria(categoria: Categoria): Categoria {
  return {
    ...categoria,
    finalidade: fromApiFinalidade(categoria.finalidade),
  };
}

function normalizeCategoriaResumoItem(item: unknown): CategoriaResumo {
  return {
    categoriaId:
      getPropertyCaseInsensitive<string>(item, [
        "categoriaId",
        "CategoriaId",
      ]) ?? "",
    descricao:
      getPropertyCaseInsensitive<string>(item, [
        "descricao",
        "Descricao",
        "nome",
        "Nome",
      ]) ?? "",
    totalReceitas: getNumericValue(item, ["totalReceitas", "TotalReceitas"]),
    totalDespesas: getNumericValue(item, ["totalDespesas", "TotalDespesas"]),
    saldo: getNumericValue(item, ["saldo", "Saldo"]),
  };
}

function normalizeCategoriaResumoResponse(
  value: unknown,
): ResumoResponse<CategoriaResumo> {
  // O backend de categoria segue o mesmo contrato flexivel usado no resumo de pessoas.
  const payload = unwrapResumoPayload(value);
  const categorias = getPropertyCaseInsensitive<unknown[]>(payload, [
    "categorias",
    "Categorias",
    "pessoas",
    "Pessoas",
  ]);
  const itens = Array.isArray(categorias)
    ? categorias.map(normalizeCategoriaResumoItem)
    : [];
  const totalReceitas = getNumericValue(payload, [
    "totalReceitasGeral",
    "TotalReceitasGeral",
  ]);
  const totalDespesas = getNumericValue(payload, [
    "totalDespesasGeral",
    "TotalDespesasGeral",
  ]);
  const saldo = getNumericValue(payload, ["saldoGeral", "SaldoGeral"]);

  return {
    itens,
    totalGeral: {
      totalReceitas,
      totalDespesas,
      // Mantem o resumo consistente mesmo quando a API nao envia o saldo agregado.
      saldo: saldo || totalReceitas - totalDespesas,
    },
  };
}

export const categoriaService = {
  async list() {
    const response = await api.get<Categoria[]>(resource);
    return response.data.map(normalizeCategoria);
  },

  async create(payload: CategoriaFormValues) {
    const response = await api.post<Categoria>(resource, {
      ...payload,
      finalidade: finalidadeParaApi[payload.finalidade],
    });
    return normalizeCategoria(response.data);
  },

  async update(id: string, payload: CategoriaFormValues) {
    const response = await api.put<Categoria>(`${resource}/${id}`, {
      ...payload,
      finalidade: finalidadeParaApi[payload.finalidade],
    });
    return normalizeCategoria(response.data);
  },

  async remove(id: string) {
    await api.delete(`${resource}/${id}`);
  },

  async getResumo() {
    const response = await api.get<unknown>(`${resource}/totais`);
    return normalizeCategoriaResumoResponse(response.data);
  },
};
