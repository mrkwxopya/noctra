export const ncBreadcrumbsTokenNames = [
  "--nc-breadcrumbs-bg",
  "--nc-breadcrumbs-border",
  "--nc-breadcrumbs-link-text",
  "--nc-breadcrumbs-link-text-hover",
  "--nc-breadcrumbs-current-text",
  "--nc-breadcrumbs-disabled-text",
  "--nc-breadcrumbs-separator-text",
  "--nc-breadcrumbs-focus-ring",
  "--nc-breadcrumbs-radius",
  "--nc-breadcrumbs-height",
  "--nc-breadcrumbs-padding-x",
  "--nc-breadcrumbs-gap"
] as const;

export type NcBreadcrumbsTokenName = (typeof ncBreadcrumbsTokenNames)[number];