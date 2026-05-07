import { noctraTokenMeta, type NoctraToken } from "@noctra/tokens";

type TokenInspectorToken = NoctraToken;

export interface TokenInspectorProps {
  title?: string;
  limit?: number;
}

export function TokenInspector(props: TokenInspectorProps) {
  const { title = "Token Inspector", limit = 12 } = props;
  const tokens = noctraTokenMeta.slice(0, limit);

  return (
    <section className="docs-token-inspector" aria-label={title}>
      <div className="docs-token-inspector__header">
        <div>
          <span className="docs-kicker">Token Inspector MVP</span>
          <h3>{title}</h3>
        </div>
        <span className="docs-token-inspector__count">{tokens.length} tokens</span>
      </div>

      <div className="docs-token-list">
        {tokens.map((token: TokenInspectorToken) => (
          <article className="docs-token-item" key={token.cssVariable}>
            <div className="docs-token-item__top">
              <code>{token.cssVariable}</code>
              <span>{token.mode}</span>
            </div>
            <strong>{token.name}</strong>
            <p>{token.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
