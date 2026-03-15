import { useMemo, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { FeedbackMessage } from "../components/FeedbackMessage";
import { LoadingState } from "../components/LoadingState";
import { SectionCard } from "../components/SectionCard";
import { useAsyncData } from "../hooks/useAsyncData";
import { pessoaService } from "../services/pessoaService";
import type { Pessoa, PessoaFormValues } from "../types/pessoaTypes";
import { normalizeApiError } from "../utils/formatters";

const initialForm: PessoaFormValues = {
  nome: "",
  idade: 0,
};

export function PessoaPage() {
  const {
    data: pessoas,
    isLoading,
    error,
    refresh,
  } = useAsyncData(pessoaService.list, [] as Pessoa[]);
  const [form, setForm] = useState<PessoaFormValues>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const isEditing = useMemo(() => editingId !== null, [editingId]);
  const pessoasOrdenadas = useMemo(() => {
    return [...pessoas].sort((firstPerson, secondPerson) =>
      firstPerson.nome.localeCompare(secondPerson.nome, "pt-BR", {
        sensitivity: "base",
      }),
    );
  }, [pessoas]);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
    setRequestError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestError(null);
    setFeedback(null);

    if (form.idade <= 0) {
      setRequestError("A idade deve ser maior que zero.");
      return;
    }

    try {
      if (isEditing && editingId) {
        await pessoaService.update(editingId, form);
        setFeedback("Pessoa atualizada com sucesso.");
      } else {
        await pessoaService.create(form);
        setFeedback("Pessoa cadastrada com sucesso.");
      }

      resetForm();
      await refresh();
    } catch (submitError) {
      setRequestError(normalizeApiError(submitError));
    }
  }

  function startEditing(person: Pessoa) {
    setEditingId(person.id);
    setForm({ nome: person.nome, idade: person.idade });
    setFeedback(null);
    setRequestError(null);
  }

  async function handleDelete(person: Pessoa) {
    const confirmed = window.confirm(
      `Excluir ${person.nome}? As transações vinculadas também serão removidas.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await pessoaService.remove(person.id);
      setFeedback("Pessoa removida com sucesso.");

      if (editingId === person.id) {
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
          title={isEditing ? "Editar pessoa" : "Nova pessoa"}
          description="Crie ou edite pessoas com nome e idade."
        >
          {feedback && <FeedbackMessage kind="success" message={feedback} />}
          {requestError && (
            <FeedbackMessage kind="danger" message={requestError} />
          )}

          <form onSubmit={handleSubmit} className="d-grid gap-3">
            <div>
              <label htmlFor="person-name" className="form-label">
                Nome
              </label>
              <input
                id="person-name"
                className="form-control"
                maxLength={200}
                value={form.nome}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    nome: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div>
              <label htmlFor="person-age" className="form-label">
                Idade
              </label>
              <input
                id="person-age"
                className="form-control"
                min={1}
                type="number"
                value={form.idade === 0 ? "" : form.idade}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    idade:
                      event.target.value === ""
                        ? 0
                        : Number(event.target.value),
                  }))
                }
                required
              />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success">
                {isEditing ? "Salvar alterações" : "Cadastrar pessoa"}
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
          title="Pessoas cadastradas"
          description="Listar Pessoas"
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

          {!isLoading && pessoasOrdenadas.length === 0 && (
            <EmptyState
              title="Nenhuma pessoa cadastrada"
              description="Cadastre a primeira pessoa para começar a controlar os gastos."
            />
          )}

          {!isLoading && pessoasOrdenadas.length > 0 && (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Idade</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pessoasOrdenadas.map((person) => (
                    <tr key={person.id}>
                      <td>
                        <div className="fw-semibold">{person.nome}</div>
                      </td>
                      <td>{person.idade} anos</td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => startEditing(person)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(person)}
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
