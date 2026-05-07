export const layoutShellAnatomy = [
  "root",
  "header",
  "header-content",
  "header-title",
  "header-actions",
  "body",
  "sidebar",
  "sidebar-title",
  "sidebar-content",
  "sidebar-footer",
  "main",
  "aside",
  "footer"
] as const;

export type LayoutShellSlot = (typeof layoutShellAnatomy)[number];