import type { ReactNode } from "react";
import { docsHref } from "../lib/docsRouting";

export type DocsChromeProps = {
  children?: ReactNode;
  [key: string]: unknown;
};

const chromeLinks = [
  { label: "Docs", href: docsHref("/") },
  { label: "Components", href: docsHref("/components") },
  { label: "Architecture", href: docsHref("/architecture") },
  { label: "Tokens", href: docsHref("/tokens") },
  { label: "GitHub", href: "https://github.com/mrkwxopya/noctra", external: true }
] as const;

export function DocsChrome({ children }: DocsChromeProps) {
  return (
    <div className="ncd3-chrome" data-noctra-docs-system="chrome">
      <header className="ncd3-topbar">
        <a className="ncd3-brand" href={docsHref("/")}>
          <span className="ncd3-brand-mark" aria-hidden="true" />
          <span>Noctra</span>
        </a>

        <nav className="ncd3-topnav" aria-label="Main docs navigation">
          {chromeLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="ncd3-content">
        {children}
      </div>
    </div>
  );
}

export default DocsChrome;
