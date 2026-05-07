export const ncRadiusTokens = [
  "--nc-radius-none",
  "--nc-radius-2xs",
  "--nc-radius-xs",
  "--nc-radius-sm",
  "--nc-radius-md",
  "--nc-radius-lg",
  "--nc-radius-xl",
  "--nc-radius-2xl",
  "--nc-radius-3xl",
  "--nc-radius-full"
] as const;

export type NcRadiusToken = (typeof ncRadiusTokens)[number];