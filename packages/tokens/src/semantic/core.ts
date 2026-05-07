export const ncSemanticBackgroundTokens = [
  "--nc-bg-page",
  "--nc-bg-base",
  "--nc-bg-subtle",
  "--nc-bg-surface",
  "--nc-bg-surface-hover",
  "--nc-bg-elevated",
  "--nc-bg-floating",
  "--nc-bg-overlay",
  "--nc-bg-glass",
  "--nc-bg-inverse"
] as const;

export const ncSemanticTextTokens = [
  "--nc-text-primary",
  "--nc-text-secondary",
  "--nc-text-muted",
  "--nc-text-subtle",
  "--nc-text-disabled",
  "--nc-text-inverse",
  "--nc-text-link",
  "--nc-text-danger",
  "--nc-text-success",
  "--nc-text-warning",
  "--nc-text-info"
] as const;

export const ncSemanticBorderTokens = [
  "--nc-border-subtle",
  "--nc-border-muted",
  "--nc-border-default",
  "--nc-border-strong",
  "--nc-border-focus",
  "--nc-border-danger",
  "--nc-border-success",
  "--nc-border-warning",
  "--nc-border-info",
  "--nc-border-interactive",
  "--nc-border-overlay",
  "--nc-border-glass"
] as const;

export type NcSemanticBackgroundToken = (typeof ncSemanticBackgroundTokens)[number];
export type NcSemanticTextToken = (typeof ncSemanticTextTokens)[number];
export type NcSemanticBorderToken = (typeof ncSemanticBorderTokens)[number];