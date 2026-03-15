import { useMemo, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { FeedbackMessage } from "../components/FeedbackMessage";
import { LoadingState } from "../components/LoadingState";
import { SectionCard } from "../components/SectionCard";
import { useAsyncData } from "../hooks/useAsyncData";
import { categoriaService } from "../services/categoriaService";
import { pessoaService } from "../services/pessoaService";
import { transacaoService } from "../services/transacaoService";
import type { Categoria } from "../types/categoriaTypes";
import type { Pessoa } from "../types/pessoaTypes";
import type {
  TipoTransacao,
  Transacao,
  TransacaoFormValues,
} from "../types/transacaoTypes";
import { formatCurrency, normalizeApiError } from "../utils/formatters";

const initialForm: TransacaoFormValues = {
  descricao: "",
  valor: 0,
  tipo: "despesa",
  categoriaId: "",
  pessoaId: "",
};

const tipoLabel: Record<TipoTransacao, string> = {
  despesa: "Despesa",
  receita: "Receita",
};

function formatCurrencyByType(valor: number, tipo: TipoTransacao) {
  const signal = tipo === "receita" ? "+" : "-";
  return `${signal} ${formatCurrency(valor)}`;
}

export function TransacaoPage() {
  const transacoesState = useAsyncData(
    transacaoService.list,
    [] as Transacao[],
  );
  const pessoasState = useAsyncData(pessoaService.list, [] as Pessoa[]);
  const categoriasState = useAsyncData(
    categoriaService.list,
    [] as Categoria[],
  );
  const [form, setForm] = useState<TransacaoFormValues>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const isEditing = useMemo(() => editingId !== null, [editingId]);

  const selectedPessoa = useMemo(
    () =>
      pessoasState.data.find((pessoa) => pessoa.id === form.pessoaId) ?? null,
    [form.pessoaId, pessoasState.data],
  );

  const tiposDisponiveis = useMemo(() => {
    if (selectedPessoa && selectedPessoa.idade < 18) {
      return ["despesa"] as const;
    }

    return ["despesa", "receita"] as const;
  }, [selectedPessoa]);

  const categoriasDisponiveis = useMemo(() => {
    return categoriasState.data.filter((categoria) => {
      return (
        categoria.finalidade === "ambas" || categoria.finalidade === form.tipo
      );
    });
  }, [categoriasState.data, form.tipo]);

  const pessoasPorId = useMemo(() => {
    return new Map(pessoasState.data.map((pessoa) => [pessoa.id, pessoa.nome]));
  }, [pessoasState.data]);

  const categoriasPorId = useMemo(() => {
    return new Map(
      categoriasState.data.map((categoria) => [
        categoria.id,
        categoria.descricao,
      ]),
    );
  }, [categoriasState.data]);

  const transacoesOrdenadas = useMemo(() => {
    return [...transacoesState.data].sort((firstTransacao, secondTransacao) =>
      firstTransacao.descricao.localeCompare(
        secondTransacao.descricao,
        "pt-BR",
        { sensitivity: "base" },
      ),
    );
  }, [transacoesState.data]);

  const isLoading =
    transacoesState.isLoading ||
    pessoasState.isLoading ||
    categoriasState.isLoading;

  const error =
    transacoesState.error || pessoasState.error || categoriasState.error;

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
    setRequestError(null);
  }

  function handlePessoaChange(pessoaId: string) {
    const nextPessoa = pessoasState.data.find(
      (pessoa) => pessoa.id === pessoaId,
    );
    const nextTipo =
      nextPessoa && nextPessoa.idade < 18 ? "despesa" : form.tipo;

    setForm((current) => ({
      ...current,
      pessoaId,
      tipo: nextTipo,
      categoriaId: "",
    }));
  }

  function handleTipoChange(tipo: TipoTransacao) {
    setForm((current) => ({
      ...current,
      tipo,
      categoriaId: "",
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestError(null);
    setFeedback(null);

    try {
      if (isEditing && editingId) {
        await transacaoService.update(editingId, form);
        setFeedback("Transacao atualizada com sucesso.");
      } else {
        await transacaoService.create(form);
        setFeedback("Transacao cadastrada com sucesso.");
      }

      resetForm();
      await transacoesState.refresh();
    } catch (submitError) {
      setRequestError(normalizeApiError(submitError));
    }
  }

  function startEditing(transacao: Transacao) {
    setEditingId(transacao.id);
    setForm({
      descricao: transacao.descricao,
      valor: transacao.valor,
      tipo: transacao.tipo,
      categoriaId: transacao.categoriaId,
      pessoaId: transacao.pessoaId,
    });
    setFeedback(null);
    setRequestError(null);
  }

  async function handleDelete(transacao: Transacao) {
    const confirmed = window.confirm(`Excluir ${transacao.descricao}?`);

    if (!confirmed) {
      return;
    }

    try {
      await transacaoService.remove(transacao.id);
      setFeedback("Transacao removida com sucesso.");

      if (editingId === transacao.id) {
        resetForm();
      }

      await transacoesState.refresh();
    } catch (deleteError) {
      setRequestError(normalizeApiError(deleteError));
    }
  }

  return (
    <div className="row g-4">
      <div className="col-xl-4">
        <SectionCard
          title={isEditing ? "Editar transação" : "Nova transação"}
          description="Crie ou edite transações com pessoa, categoria, tipo e valor."
        >
          {feedback && <FeedbackMessage kind="success" message={feedback} />}
          {requestError && (
            <FeedbackMessage kind="danger" message={requestError} />
          )}

          <form onSubmit={handleSubmit} className="d-grid gap-3">
            <div>
              <label htmlFor="transaction-person" className="form-label">
                Pessoa
              </label>
              <select
                id="transaction-person"
                className="form-select"
                value={form.pessoaId}
                onChange={(event) => handlePessoaChange(event.target.value)}
                required
              >
                <option value="">Selecione uma pessoa</option>
                {pessoasState.data.map((pessoa) => (
                  <option key={pessoa.id} value={pessoa.id}>
                    {pessoa.nome} ({pessoa.idade} anos)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="transaction-description" className="form-label">
                Descrição
              </label>
              <input
                id="transaction-description"
                className="form-control"
                maxLength={400}
                value={form.descricao}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    descricao: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="transaction-value" className="form-label">
                  Valor
                </label>
                <input
                  id="transaction-value"
                  className="form-control"
                  min={0.01}
                  step="0.01"
                  type="number"
                  value={form.valor === 0 ? "" : form.valor}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      valor:
                        event.target.value === ""
                          ? 0
                          : Number(event.target.value),
                    }))
                  }
                  required
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="transaction-type" className="form-label">
                  Tipo
                </label>
                <select
                  id="transaction-type"
                  className="form-select"
                  value={form.tipo}
                  onChange={(event) =>
                    handleTipoChange(event.target.value as TipoTransacao)
                  }
                >
                  {tiposDisponiveis.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipoLabel[tipo]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="transaction-category" className="form-label">
                Categoria
              </label>
              <select
                id="transaction-category"
                className="form-select"
                value={form.categoriaId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    categoriaId: event.target.value,
                  }))
                }
                required
              >
                <option value="">Selecione uma categoria</option>
                {categoriasDisponiveis.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.descricao}
                  </option>
                ))}
              </select>
            </div>

            {selectedPessoa && selectedPessoa.idade < 18 && (
              <FeedbackMessage
                kind="info"
                message="Pessoa menor de idade: apenas despesas estão disponíveis."
              />
            )}

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success">
                {isEditing ? "Salvar alterações" : "Cadastrar transação"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={resetForm}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </SectionCard>
      </div>

      <div className="col-xl-8">
        <SectionCard
          title="Transações cadastradas"
          description="Listar de Transações"
          action={
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => transacoesState.refresh().catch(() => undefined)}
            >
              Atualizar
            </button>
          }
        >
          {isLoading && <LoadingState />}
          {error && <FeedbackMessage kind="danger" message={error} />}

          {!isLoading && transacoesOrdenadas.length === 0 && (
            <EmptyState
              title="Nenhuma transação cadastrada"
              description="Cadastre a primeira transação para começar a acompanhar os lançamentos."
            />
          )}

          {!isLoading && transacoesOrdenadas.length > 0 && (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Pessoa</th>
                    <th>Categoria</th>
                    <th>Tipo</th>
                    <th className="text-end">Valor</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {transacoesOrdenadas.map((transacao) => (
                    <tr key={transacao.id}>
                      <td>
                        <div className="fw-semibold">{transacao.descricao}</div>
                      </td>
                      <td>
                        {transacao.pessoaNome ??
                          pessoasPorId.get(transacao.pessoaId) ??
                          transacao.pessoaId}
                      </td>
                      <td>
                        {transacao.categoriaDescricao ??
                          categoriasPorId.get(transacao.categoriaId) ??
                          transacao.categoriaId}
                      </td>
                      <td>{tipoLabel[transacao.tipo]}</td>
                      <td
                        className={`text-end fw-semibold ${
                          transacao.tipo === "receita"
                            ? "transaction-value-income"
                            : "transaction-value-expense"
                        }`}
                      >
                        {formatCurrencyByType(transacao.valor, transacao.tipo)}
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => startEditing(transacao)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(transacao)}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
