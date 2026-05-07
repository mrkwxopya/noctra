export const ncTableOfContentsTokenNames = [
  "--nc-table-of-contents-bg",
  "--nc-table-of-contents-border",
  "--nc-table-of-contents-heading-text",
  "--nc-table-of-contents-description-text",
  "--nc-table-of-contents-link-text",
  "--nc-table-of-contents-link-text-hover",
  "--nc-table-of-contents-link-bg-hover",
  "--nc-table-of-contents-link-bg-active",
  "--nc-table-of-contents-link-text-active",
  "--nc-table-of-contents-guide",
  "--nc-table-of-contents-badge-bg",
  "--nc-table-of-contents-badge-text",
  "--nc-table-of-contents-focus-ring",
  "--nc-table-of-contents-radius",
  "--nc-table-of-contents-padding",
  "--nc-table-of-contents-gap"
] as const;

export type NcTableOfContentsTokenName = (typeof ncTableOfContentsTokenNames)[number];