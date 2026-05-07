export type NoctraToken = {
  name: string;
  path: string;
  value: string | number;
  type: string;
  category: string;
  description?: string;
  [key: string]: unknown;
};

export type NoctraTokenGroup = {
  name: string;
  label: string;
  tokens: readonly NoctraToken[];
  items?: readonly NoctraToken[];
  [key: string]: unknown;
};

export const tokenList: NoctraToken[] = [
  { name: "color.background", path: "color.background", value: "#050812", type: "color", category: "color", description: "Main page background" },
  { name: "color.surface", path: "color.surface", value: "#0f172a", type: "color", category: "color", description: "Default surface" },
  { name: "color.text", path: "color.text", value: "#f8fafc", type: "color", category: "color", description: "Primary text" },
  { name: "color.muted", path: "color.muted", value: "#94a3b8", type: "color", category: "color", description: "Muted text" },
  { name: "color.primary", path: "color.primary", value: "#8b5cf6", type: "color", category: "color", description: "Primary accent" },
  { name: "radius.sm", path: "radius.sm", value: "6px", type: "radius", category: "radius", description: "Small radius" },
  { name: "radius.md", path: "radius.md", value: "10px", type: "radius", category: "radius", description: "Medium radius" },
  { name: "radius.lg", path: "radius.lg", value: "14px", type: "radius", category: "radius", description: "Large radius" },
  { name: "spacing.sm", path: "spacing.sm", value: "8px", type: "spacing", category: "spacing", description: "Small spacing" },
  { name: "spacing.md", path: "spacing.md", value: "12px", type: "spacing", category: "spacing", description: "Medium spacing" },
  { name: "spacing.lg", path: "spacing.lg", value: "16px", type: "spacing", category: "spacing", description: "Large spacing" }
];

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
    lg: "14px"
  },
  spacing: {
    sm: "8px",
    md: "12px",
    lg: "16px"
  }
} as const;

export const tokens = noctraTokens;

export const tokenGroups: NoctraTokenGroup[] = [
  { name: "color", label: "Color", tokens: tokenList.filter((token: NoctraToken) => token.category === "color") },
  { name: "radius", label: "Radius", tokens: tokenList.filter((token: NoctraToken) => token.category === "radius") },
  { name: "spacing", label: "Spacing", tokens: tokenList.filter((token: NoctraToken) => token.category === "spacing") }
];

export const noctraTokenMeta = tokenList;

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
