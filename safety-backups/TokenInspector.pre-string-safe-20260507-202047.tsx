import { noctraTokenMeta, type NoctraToken } from "@noctra/tokens";

type TokenView = {
  key: string;
  name: string;
  value: string;
  type: string;
  category: string;
  description: string;
};

function safeString(value: unknown, fallback = ""): string {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
  return fallback;
}

function normalizeToken(token: NoctraToken, index: number): TokenView {
  const name = safeString(token.name ?? token.path, `token-${index + 1}`);
  const path = safeString(token.path, name);

  return {
    key: path || name || `token-${index + 1}`,
    name,
    value: safeString(token.value, "—"),
    type: safeString(token.type, "token"),
    category: safeString(token.category, "general"),
    description: safeString(token.description)
  };
}

const tokens: TokenView[] = noctraTokenMeta.map((token: NoctraToken, index: number) => normalizeToken(token, index));

export function TokenInspector() {
  return (
    <section className="ncd3-card">
      <div className="ncd3-section-title">
        <h2>Token inspector</h2>
        <p>Preview the active token metadata used by the docs build.</p>
      </div>

      <div className="ncd3-table-card">
        <table className="ncd3-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
              <th>Type</th>
              <th>Category</th>
            </tr>
          </thead>

          <tbody>
            {tokens.map((token: TokenView) => (
              <tr key={token.key}>
                <td>
                  <code>{token.name}</code>
                  {token.description ? <p>{token.description}</p> : null}
                </td>
                <td>{token.value}</td>
                <td>{token.type}</td>
                <td>{token.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TokenInspector;
