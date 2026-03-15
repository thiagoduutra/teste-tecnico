import type { PropsWithChildren } from "react";

type SecaoAtiva = "background" | "pessoas" | "categorias" | "transacoes";

interface AppShellProps {
  secaoAtiva: SecaoAtiva;
  onSecaoChange: (secao: SecaoAtiva) => void;
}

// Centraliza os textos do cabecalho para manter a navegação padronizada.
const secoes: Record<SecaoAtiva, { titulo: string; descricao: string }> = {
  background: {
    titulo: "Consultar valores",
    descricao: "Consultas de totais por pessoa e categoria.",
  },
  pessoas: {
    titulo: "Pessoas",
    descricao: "Cadastro de pessoas.",
  },
  categorias: {
    titulo: "Categorias",
    descricao: "Cadastro de categorias.",
  },
  transacoes: {
    titulo: "Transações",
    descricao: "Cadastro de transações.",
  },
};

export function AppShell({
  secaoAtiva,
  onSecaoChange,
  children,
}: PropsWithChildren<AppShellProps>) {
  // A seção ativa define o contexto visual exibido no topo da tela.
  const secao = secoes[secaoAtiva];

  return (
    <div className="app-shell">
      <div className="container py-4 py-lg-5">
        <section className="hero-panel p-4 p-lg-5 mb-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <h1 className="stat-card p-3 h-100">
                Controle de gastos residênciais
              </h1>
            </div>
            <div className="col-lg-4">
              <div className="stat-card p-3 h-100">
                <h2 className="h4 mb-2">{secao.titulo}</h2>
                <p className="text-secondary mb-0">{secao.descricao}</p>
              </div>
            </div>
          </div>
        </section>

        <nav className="section-nav nav nav-pills gap-2 mb-4 flex-wrap">
          <button
            type="button"
            className={`nav-link ${secaoAtiva === "background" ? "active" : ""}`}
            onClick={() => onSecaoChange("background")}
          >
            Resumo
          </button>
          <button
            type="button"
            className={`nav-link ${secaoAtiva === "pessoas" ? "active" : ""}`}
            onClick={() => onSecaoChange("pessoas")}
          >
            Pessoas
          </button>
          <button
            type="button"
            className={`nav-link ${secaoAtiva === "categorias" ? "active" : ""}`}
            onClick={() => onSecaoChange("categorias")}
          >
            Categorias
          </button>
          <button
            type="button"
            className={`nav-link ${secaoAtiva === "transacoes" ? "active" : ""}`}
            onClick={() => onSecaoChange("transacoes")}
          >
            Transações
          </button>
        </nav>

        <main className="page-fade">{children}</main>
      </div>
    </div>
  );
}
