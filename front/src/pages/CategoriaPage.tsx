import { useMemo, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { FeedbackMessage } from "../components/FeedbackMessage";
import { LoadingState } from "../components/LoadingState";
import { SectionCard } from "../components/SectionCard";
import { useAsyncData } from "../hooks/useAsyncData";
import { categoriaService } from "../services/categoriaService";
import type {
  Categoria,
  CategoriaFormValues,
  FinalidadeCategoria,
} from "../types/categoriaTypes";
import { normalizeApiError } from "../utils/formatters";

const initialForm: CategoriaFormValues = {
  descricao: "",
  finalidade: "ambas",
};

const finalidadeLabel: Record<FinalidadeCategoria, string> = {
  despesa: "Despesa",
  receita: "Receita",
  ambas: "Ambas",
};

export function CategoriaPage() {
  const {
    data: categorias,
    isLoading,
    error,
    refresh,
  } = useAsyncData(categoriaService.list, [] as Categoria[]);
  const [form, setForm] = useState<CategoriaFormValues>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const isEditing = useMemo(() => editingId !== null, [editingId]);
  const categoriasOrdenadas = useMemo(() => {
    return [...categorias].sort((firstCategory, secondCategory) =>
      firstCategory.descricao.localeCompare(secondCategory.descricao, "pt-BR", {
        sensitivity: "base",
      }),
    );
  }, [categorias]);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
    setRequestError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestError(null);
    setFeedback(null);

    try {
      if (isEditing && editingId) {
        await categoriaService.update(editingId, form);
        setFeedback("Categoria atualizada com sucesso.");
      } else {
        await categoriaService.create(form);
        setFeedback("Categoria cadastrada com sucesso.");
      }

      resetForm();
      await refresh();
    } catch (submitError) {
      setRequestError(normalizeApiError(submitError));
    }
  }

  function startEditing(categoria: Categoria) {
    setEditingId(categoria.id);
    setForm({
      descricao: categoria.descricao,
      finalidade: categoria.finalidade,
    });
    setFeedback(null);
    setRequestError(null);
  }

  async function handleDelete(categoria: Categoria) {
    const confirmed = window.confirm(
      `Excluir ${categoria.descricao}? As transacões vinculadas podem ser afetadas.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await categoriaService.remove(categoria.id);
      setFeedback("Categoria removida com sucesso.");

      if (editingId === categoria.id) {
        resetForm();
      }

      await refresh();
    } catch (deleteError) {
      setRequestError(normalizeApiError(deleteError));
    }
  }

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <SectionCard
          title={isEditing ? "Editar categoria" : "Nova categoria"}
          description="Crie ou edite categorias com descrição e finalidade."
        >
          {feedback && <FeedbackMessage kind="success" message={feedback} />}
          {requestError && (
            <FeedbackMessage kind="danger" message={requestError} />
          )}

          <form onSubmit={handleSubmit} className="d-grid gap-3">
            <div>
              <label htmlFor="category-description" className="form-label">
                Descrição
              </label>
              <input
                id="category-description"
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

            <div>
              <label htmlFor="category-purpose" className="form-label">
                Finalidade
              </label>
              <select
                id="category-purpose"
                className="form-select"
                value={form.finalidade}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    finalidade: event.target.value as FinalidadeCategoria,
                  }))
                }
              >
                <option value="despesa">Despesa</option>
                <option value="receita">Receita</option>
                <option value="ambas">Ambas</option>
              </select>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success">
                {isEditing ? "Salvar alteracoes" : "Cadastrar categoria"}
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

      <div className="col-lg-8">
        <SectionCard
          title="Categorias cadastradas"
          description="Listar Categorias"
          action={
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => refresh().catch(() => undefined)}
            >
              Atualizar
            </button>
          }
        >
          {isLoading && <LoadingState />}
          {error && <FeedbackMessage kind="danger" message={error} />}

          {!isLoading && categoriasOrdenadas.length === 0 && (
            <EmptyState
              title="Nenhuma categoria cadastrada"
              description="Cadastre a primeira categoria para organizar os lançamentos."
            />
          )}

          {!isLoading && categoriasOrdenadas.length > 0 && (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Finalidade</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {categoriasOrdenadas.map((categoria) => (
                    <tr key={categoria.id}>
                      <td>
                        <div className="fw-semibold">{categoria.descricao}</div>
                      </td>
                      <td>{finalidadeLabel[categoria.finalidade]}</td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => startEditing(categoria)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(categoria)}
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
