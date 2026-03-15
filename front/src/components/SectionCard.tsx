import type { PropsWithChildren, ReactNode } from "react";

interface SectionCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionCard({
  title,
  description,
  action,
  children,
}: PropsWithChildren<SectionCardProps>) {
  return (
    <section className="card surface-card h-100">
      <div className="card-body p-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 mb-4">
          <div>
            <h2 className="h4 mb-1 section-title">{title}</h2>
            {description && <p className="section-description mb-0">{description}</p>}
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}
