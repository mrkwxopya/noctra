export const accordionAnatomy = [
  "root",
  "item",
  "control",
  "chevron",
  "icon",
  "content",
  "label",
  "description",
  "right-section",
  "panel",
  "panel-content"
] as const;

export type AccordionSlot = (typeof accordionAnatomy)[number];