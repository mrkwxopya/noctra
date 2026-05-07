export const selectAnatomy = [
  "root",
  "label",
  "description",
  "control",
  "value",
  "placeholder",
  "clear",
  "chevron",
  "dropdown",
  "search",
  "content",
  "group",
  "group-label",
  "separator",
  "option",
  "option-button",
  "indicator",
  "icon",
  "option-content",
  "option-label",
  "option-description",
  "badge",
  "right-section",
  "empty"
] as const;

export type SelectSlot = (typeof selectAnatomy)[number];