export const ncCreditCardTokenNames = [
  "--nc-credit-card-bg",
  "--nc-credit-card-border",
  "--nc-credit-card-text",
  "--nc-credit-card-muted-text",
  "--nc-credit-card-preview-bg",
  "--nc-credit-card-preview-text",
  "--nc-credit-card-control-bg",
  "--nc-credit-card-control-bg-hover",
  "--nc-credit-card-focus-ring",
  "--nc-credit-card-radius",
  "--nc-credit-card-gap",
  "--nc-credit-card-height"
] as const;

export type NcCreditCardTokenName = (typeof ncCreditCardTokenNames)[number];