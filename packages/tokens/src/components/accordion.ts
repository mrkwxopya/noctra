export const ncAccordionTokenNames = [
  "--nc-accordion-bg",
  "--nc-accordion-border",
  "--nc-accordion-text",
  "--nc-accordion-muted-text",
  "--nc-accordion-item-bg",
  "--nc-accordion-item-bg-open",
  "--nc-accordion-control-bg",
  "--nc-accordion-control-bg-hover",
  "--nc-accordion-control-text-open",
  "--nc-accordion-icon-text",
  "--nc-accordion-chevron-text",
  "--nc-accordion-panel-bg",
  "--nc-accordion-focus-ring",
  "--nc-accordion-radius",
  "--nc-accordion-padding",
  "--nc-accordion-gap",
  "--nc-accordion-control-height"
] as const;

export type NcAccordionTokenName = (typeof ncAccordionTokenNames)[number];