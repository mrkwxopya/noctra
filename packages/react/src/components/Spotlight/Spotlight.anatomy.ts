export const spotlightAnatomy = [
  "root",
  "overlay",
  "dialog",
  "header",
  "title",
  "description",
  "close-button",
  "search",
  "body",
  "section",
  "section-title",
  "list",
  "action",
  "action-icon",
  "action-content",
  "action-title",
  "action-description",
  "shortcut",
  "empty"
] as const;

export type SpotlightSlot = (typeof spotlightAnatomy)[number];