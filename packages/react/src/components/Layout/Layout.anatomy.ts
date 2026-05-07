export const layoutAnatomy = [
  "root",
  "header",
  "toolbar",
  "shell",
  "sidebar",
  "main",
  "content",
  "aside",
  "footer"
] as const;

export type LayoutSlot = (typeof layoutAnatomy)[number];