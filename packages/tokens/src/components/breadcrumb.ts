export const ncBreadcrumbTokenNames = [
  "--nc-breadcrumb-bg",
  "--nc-breadcrumb-border",
  "--nc-breadcrumb-text",
  "--nc-breadcrumb-muted-text",
  "--nc-breadcrumb-link-text",
  "--nc-breadcrumb-link-text-hover",
  "--nc-breadcrumb-link-bg-hover",
  "--nc-breadcrumb-current-text",
  "--nc-breadcrumb-icon-text",
  "--nc-breadcrumb-separator-text",
  "--nc-breadcrumb-collapse-bg",
  "--nc-breadcrumb-collapse-text",
  "--nc-breadcrumb-focus-ring",
  "--nc-breadcrumb-radius",
  "--nc-breadcrumb-padding",
  "--nc-breadcrumb-gap"
] as const;

export type NcBreadcrumbTokenName = (typeof ncBreadcrumbTokenNames)[number];