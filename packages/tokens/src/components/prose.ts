export const ncProseTokenNames = [
  "--nc-prose-bg",
  "--nc-prose-border",
  "--nc-prose-text",
  "--nc-prose-muted-text",
  "--nc-prose-heading-text",
  "--nc-prose-link-text",
  "--nc-prose-code-bg",
  "--nc-prose-code-text",
  "--nc-prose-quote-border",
  "--nc-prose-focus-ring",
  "--nc-prose-radius",
  "--nc-prose-padding",
  "--nc-prose-gap",
  "--nc-prose-measure"
] as const;

export type NcProseTokenName = (typeof ncProseTokenNames)[number];