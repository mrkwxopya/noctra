export const appShellAnatomy = [
  "root",
  "header",
  "brand",
  "logo",
  "brand-label",
  "toolbar",
  "actions",
  "body",
  "navbar",
  "main",
  "aside",
  "footer"
] as const;

export type AppShellSlot = (typeof appShellAnatomy)[number];