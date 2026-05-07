export type NoctraToken = {
  name?: string;
  path?: string;
  value?: string | number;
  type?: string;
  category?: string;
  description?: string;
  [key: string]: unknown;
};

export type NoctraTokenGroup = {
  name?: string;
  label?: string;
  tokens?: readonly NoctraToken[];
  items?: readonly NoctraToken[];
  [key: string]: unknown;
};

export const noctraTokens = {
  color: {
    background: "#050812",
    surface: "#0f172a",
    text: "#f8fafc",
    muted: "#94a3b8",
    primary: "#8b5cf6"
  },
  radius: {
    sm: "6px",
    md: "10px",
    lg: "14px",
    xl: "18px"
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px"
  }
} as const;

export const tokens = noctraTokens;

export const tokenList: NoctraToken[] = [
  { name: "color.background", path: "color.background", value: "#050812", type: "color", category: "color" },
  { name: "color.surface", path: "color.surface", value: "#0f172a", type: "color", category: "color" },
  { name: "color.text", path: "color.text", value: "#f8fafc", type: "color", category: "color" },
  { name: "color.primary", path: "color.primary", value: "#8b5cf6", type: "color", category: "color" },
  { name: "radius.md", path: "radius.md", value: "10px", type: "radius", category: "radius" },
  { name: "spacing.md", path: "spacing.md", value: "12px", type: "spacing", category: "spacing" }
];

export const tokenGroups: NoctraTokenGroup[] = [
  { name: "color", label: "Color", tokens: tokenList.filter((token: NoctraToken) => token.category === "color") },
  { name: "radius", label: "Radius", tokens: tokenList.filter((token: NoctraToken) => token.category === "radius") },
  { name: "spacing", label: "Spacing", tokens: tokenList.filter((token: NoctraToken) => token.category === "spacing") }
];

export const primitiveTokens = noctraTokens;
export const semanticTokens = noctraTokens;
export const componentTokens = noctraTokens;
export const themeTokens = noctraTokens;

export function getToken(path: string): NoctraToken | undefined {
  return tokenList.find((token: NoctraToken) => token.path === path || token.name === path);
}

export function flattenTokens(): NoctraToken[] {
  return tokenList;
}

export default noctraTokens;
