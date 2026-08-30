import type { ReactNode } from "react";

interface Props {
  title?: string;
  description?: string;
  children: ReactNode;
}

export function Card({ title, description, children }: Props) {
  return (
    <section className="card">
      {title && <h2>{title}</h2>}
      {description && <p className="card-description">{description}</p>}
      {children}
    </section>
  );
}
