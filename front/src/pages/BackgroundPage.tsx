import { EmptyState } from "../components/EmptyState";
import { FeedbackMessage } from "../components/FeedbackMessage";
import { LoadingState } from "../components/LoadingState";
import { SectionCard } from "../components/SectionCard";
import { useAsyncData } from "../hooks/useAsyncData";
import { categoriaService } from "../services/categoriaService";
import { pessoaService } from "../services/pessoaService";
import type {
  CategoriaResumo,
  PessoaResumo,
  ResumoResponse,
  TotaisResumo,
} from "../types/resumoTypes";
import { formatCurrency, hasHttpStatus } from "../utils/formatters";

const totaisVazios: TotaisResumo = {
  totalReceitas: 0,
  totalDespesas: 0,
  saldo: 0,
};

const resumoPessoasInicial: ResumoResponse<PessoaResumo> = {
  itens: [],
  totalGeral: totaisVazios,
};

const resumoCategoriasInicial: ResumoResponse<CategoriaResumo> = {
  itens: [],
  totalGeral: totaisVazios,
};

export function BackgroundPage() {
  const pessoasResumoState = useAsyncData(
    pessoaService.getResumo,
    resumoPessoasInicial,
    {
      errorMessage:
        "Nao foi possivel carregar o resumo por pessoa. Verifique o endpoint de totais da API.",
    },
  );

  const categoriasResumoState = useAsyncData(
    categoriaService.getResumo,
    resumoCategoriasInicial,
    {
      shouldIgnoreError: (error) => hasHttpStatus(error, 404),
    },
  );

  const resumoPessoas = pessoasResumoState.data;
  const resumoCategorias = categoriasResumoState.data;
  const isLoading =
    pessoasResumoState.isLoading || categoriasResumoState.isLoading;
  const error = pessoasResumoState.error || categoriasResumoState.error;

  return (
    <div className="d-grid gap-4">
      {isLoading && <LoadingState />}
      {error && <FeedbackMessage kind="danger" message={error} />}

      <div className="row g-4">
        <div className="col-xl-6">
          <SectionCard
            title="Totais por pessoa"
            description="Receitas, despesas e saldo de cada pessoa cadastrada."
            action={
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={() =>
                  pessoasResumoState.refresh().catch(() => undefined)
                }
              >
                Atualizar
              </button>
            }
          >
            {resumoPessoas.itens.length === 0 ? (
              <EmptyState
                title="Sem totais por pessoa"
                description="Os totais aparecerão aqui depois que pessoas e transações forem cadastradas."
              />
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Pessoa</th>
                      <th className="text-end">Receitas</th>
                      <th className="text-end">Despesas</th>
                      <th className="text-end">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumoPessoas.itens.map((item) => (
                      <tr key={item.pessoaId}>
                        <td>{item.nome}</td>
                        <td className="text-end">
                          {formatCurrency(item.totalReceitas)}
                        </td>
                        <td className="text-end">
                          {formatCurrency(item.totalDespesas)}
                        </td>
                        <td className="text-end fw-semibold">
                          {formatCurrency(item.saldo)}
                        </td>
                      </tr>
                    ))}
                    <tr className="table-light fw-semibold">
                      <td>Total geral</td>
                      <td className="text-end">
                        {formatCurrency(resumoPessoas.totalGeral.totalReceitas)}
                      </td>
                      <td className="text-end">
                        {formatCurrency(resumoPessoas.totalGeral.totalDespesas)}
                      </td>
                      <td className="text-end">
                        {formatCurrency(resumoPessoas.totalGeral.saldo)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </div>

        <div className="col-xl-6">
          <SectionCard
            title="Totais por categoria"
            description="Receitas, despesas e saldo de cada categoria cadastrada."
            action={
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={() =>
                  categoriasResumoState.refresh().catch(() => undefined)
                }
              >
                Atualizar
              </button>
            }
          >
            {resumoCategorias.itens.length === 0 ? (
              <EmptyState
                title="Sem totais por categoria"
                description="Os totais aparecerão aqui quando os lançamentos de categoria estiverem disponiveis."
              />
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Categoria</th>
                      <th className="text-end">Receitas</th>
                      <th className="text-end">Despesas</th>
                      <th className="text-end">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumoCategorias.itens.map((item) => (
                      <tr key={item.categoriaId}>
                        <td>{item.descricao}</td>
                        <td className="text-end">
                          {formatCurrency(item.totalReceitas)}
                        </td>
                        <td className="text-end">
                          {formatCurrency(item.totalDespesas)}
                        </td>
                        <td className="text-end fw-semibold">
                          {formatCurrency(item.saldo)}
                        </td>
                      </tr>
                    ))}
                    <tr className="table-light fw-semibold">
                      <td>Total geral</td>
                      <td className="text-end">
                        {formatCurrency(
                          resumoCategorias.totalGeral.totalReceitas,
                        )}
                      </td>
                      <td className="text-end">
                        {formatCurrency(
                          resumoCategorias.totalGeral.totalDespesas,
                        )}
                      </td>
                      <td className="text-end">
                        {formatCurrency(resumoCategorias.totalGeral.saldo)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
