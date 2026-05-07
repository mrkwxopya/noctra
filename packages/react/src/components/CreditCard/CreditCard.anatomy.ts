export const creditCardAnatomy = [
  "root",
  "label",
  "description",
  "preview",
  "preview-label",
  "preview-brand",
  "preview-number",
  "preview-meta",
  "preview-name",
  "preview-expiry",
  "fields",
  "field",
  "field-label",
  "input",
  "message"
] as const;

export type CreditCardSlot = (typeof creditCardAnatomy)[number];