export function LoadingState() {
  return (
    <div className="d-flex align-items-center gap-3 py-3">
      <div className="spinner-border text-success" role="status" />
      <span>Carregando dados...</span>
    </div>
  );
}
