export const ncTextareaTokenNames = [
  "--nc-textarea-bg",
  "--nc-textarea-border",
  "--nc-textarea-text",
  "--nc-textarea-muted-text",
  "--nc-textarea-control-bg",
  "--nc-textarea-control-bg-hover",
  "--nc-textarea-section-text",
  "--nc-textarea-clear-text",
  "--nc-textarea-focus-ring",
  "--nc-textarea-radius",
  "--nc-textarea-padding",
  "--nc-textarea-gap",
  "--nc-textarea-line-height",
  "--nc-textarea-min-rows",
  "--nc-textarea-max-rows"
] as const;

export type NcTextareaTokenName = (typeof ncTextareaTokenNames)[number];