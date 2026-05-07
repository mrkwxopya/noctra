export const codeAnatomy = [
  "root",
  "block",
  "header",
  "label",
  "description",
  "body",
  "line",
  "line-number",
  "line-content"
] as const;

export type CodeSlot = (typeof codeAnatomy)[number];