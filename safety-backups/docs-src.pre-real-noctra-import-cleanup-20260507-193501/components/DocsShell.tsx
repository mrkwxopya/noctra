import type { ReactNode } from "react";

type CompatProps = {
  children?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  label?: ReactNode;
  value?: ReactNode;
  code?: string;
  activeRoute?: unknown;
  className?: string;
  [key: string]: unknown;
};

function getText(value: ReactNode) {
  return typeof value === "string" || typeof value === "number" ? value : null;
}

export function DocsShell({ children }: CompatProps) {
  return <>{children}</>;
}

export function PageIntro({ eyebrow, title, subtitle, description, children }: CompatProps) {
  return (
    <section className="nd-hero">
      <div className="nd-hero-content">
        {eyebrow ? <span className="nd-kicker">{eyebrow}</span> : null}
        {title ? <h1>{title}</h1> : null}
        {subtitle ? <p>{subtitle}</p> : null}
        {description ? <p>{description}</p> : null}
        {children}
      </div>
    </section>
  );
}

export function DocsSection({ title, description, children }: CompatProps) {
  return (
    <section className="nd-doc-section">
      {(title || description) ? (
        <div className="nd-section-title">
          {title ? <h2>{title}</h2> : null}
          {description ? <p>{description}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function InfoCard({ title, description, children }: CompatProps) {
  return (
    <section className="nd-card">
      {(title || description) ? (
        <div className="nd-card-header">
          {title ? <h3>{title}</h3> : null}
          {description ? <p>{description}</p> : null}
        </div>
      ) : null}
      {children ? <div className="nd-card-body">{children}</div> : null}
    </section>
  );
}

export function HeroCard({ title, description, children }: CompatProps) {
  return (
    <section className="nd-card" data-premium>
      {(title || description) ? (
        <div className="nd-card-header">
          {title ? <h3>{title}</h3> : null}
          {description ? <p>{description}</p> : null}
        </div>
      ) : null}
      {children ? <div className="nd-card-body">{children}</div> : null}
    </section>
  );
}

export function CodePanel({ code, children }: CompatProps) {
  const content = code ?? getText(children) ?? "";

  return (
    <pre className="nd-code">
      <code>{content}</code>
    </pre>
  );
}

export default DocsShell;