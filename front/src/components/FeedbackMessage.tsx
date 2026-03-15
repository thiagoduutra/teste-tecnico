interface FeedbackMessageProps {
  kind: "success" | "danger" | "warning" | "info";
  message: string;
}

export function FeedbackMessage({
  kind,
  message,
}: FeedbackMessageProps) {
  return <div className={`alert alert-${kind} mb-3`}>{message}</div>;
}
