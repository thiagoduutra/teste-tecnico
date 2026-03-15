interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="empty-state rounded-4 p-4 text-center">
      <h3 className="h5 empty-state-title">{title}</h3>
      <p className="empty-state-description mb-0">{description}</p>
    </div>
  );
}
