import { useState } from "react";
import { AppShell } from "./components/AppShell";
import { BackgroundPage } from "./pages/BackgroundPage";
import { CategoriaPage } from "./pages/CategoriaPage";
import { PessoaPage } from "./pages/PessoaPage";
import { TransacaoPage } from "./pages/TransacaoPage";

type SecaoAtiva = "background" | "pessoas" | "categorias" | "transacoes";

function App() {
  // Controla qual modulo do sistema esta visivel na navegacao principal.
  const [secaoAtiva, setSecaoAtiva] = useState<SecaoAtiva>("pessoas");

  return (
    <AppShell secaoAtiva={secaoAtiva} onSecaoChange={setSecaoAtiva}>
      {secaoAtiva === "background" && <BackgroundPage />}
      {secaoAtiva === "pessoas" && <PessoaPage />}
      {secaoAtiva === "categorias" && <CategoriaPage />}
      {secaoAtiva === "transacoes" && <TransacaoPage />}
    </AppShell>
  );
}

export default App;
