import api from "./api";
import type {
  TipoTransacao,
  Transacao,
  TransacaoFormValues,
} from "../types/transacaoTypes";

const resource = "/transacao";

const tipoParaApi: Record<TipoTransacao, number> = {
  despesa: 1,
  receita: 2,
};

function fromApiTipo(value: TipoTransacao | number): TipoTransacao {
  if (value === 1) {
    return "despesa";
  }

  if (value === 2) {
    return "receita";
  }

  return value as TipoTransacao;
}

function normalizeTransacao(transacao: Transacao): Transacao {
  return {
    ...transacao,
    tipo: fromApiTipo(transacao.tipo),
  };
}

export const transacaoService = {
  async list() {
    const response = await api.get<Transacao[]>(resource);
    return response.data.map(normalizeTransacao);
  },

  async create(payload: TransacaoFormValues) {
    const response = await api.post<Transacao>(resource, {
      ...payload,
      tipo: tipoParaApi[payload.tipo],
    });
    return normalizeTransacao(response.data);
  },

  async update(id: string, payload: TransacaoFormValues) {
    const response = await api.put<Transacao>(`${resource}/${id}`, {
      ...payload,
      tipo: tipoParaApi[payload.tipo],
    });
    return normalizeTransacao(response.data);
  },

  async remove(id: string) {
    await api.delete(`${resource}/${id}`);
  },
};
