import api from "./api";
import type { Pessoa, PessoaFormValues } from "../types/pessoaTypes";
import type { PessoaResumo, ResumoResponse } from "../types/resumoTypes";

const resource = "/pessoa";

type UnknownRecord = Record<string, unknown>;

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

function normalizePessoaResumoItem(item: unknown): PessoaResumo {
  return {
    pessoaId:
      getPropertyCaseInsensitive<string>(item, ["pessoaId", "PessoaId"]) ?? "",
    nome: getPropertyCaseInsensitive<string>(item, ["nome", "Nome"]) ?? "",
    totalReceitas: getNumericValue(item, ["totalReceitas", "TotalReceitas"]),
    totalDespesas: getNumericValue(item, ["totalDespesas", "TotalDespesas"]),
    saldo: getNumericValue(item, ["saldo", "Saldo"]),
  };
}

function normalizePessoaResumoResponse(value: unknown): ResumoResponse<PessoaResumo> {
  const payload = unwrapResumoPayload(value);
  const pessoas = getPropertyCaseInsensitive<unknown[]>(payload, [
    "pessoas",
    "Pessoas",
  ]);
  const itens = Array.isArray(pessoas)
    ? pessoas.map(normalizePessoaResumoItem)
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
      saldo:
        saldo || totalReceitas - totalDespesas,
    },
  };
}

export const pessoaService = {
  async list() {
    const response = await api.get<Pessoa[]>(resource);
    return response.data;
  },

  async create(payload: PessoaFormValues) {
    const response = await api.post<Pessoa>(resource, payload);
    return response.data;
  },

  async update(id: string, payload: PessoaFormValues) {
    const response = await api.put<Pessoa>(`${resource}/${id}`, payload);
    return response.data;
  },

  async remove(id: string) {
    await api.delete(`${resource}/${id}`);
  },

  async getResumo() {
    const response = await api.get<unknown>(`${resource}/totais`);
    return normalizePessoaResumoResponse(response.data);
  },
};
