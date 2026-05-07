export const ncTagsInputTokenNames = [
  "--nc-tags-input-bg",
  "--nc-tags-input-border",
  "--nc-tags-input-text",
  "--nc-tags-input-muted-text",
  "--nc-tags-input-control-bg",
  "--nc-tags-input-control-bg-hover",
  "--nc-tags-input-tag-bg",
  "--nc-tags-input-tag-text",
  "--nc-tags-input-tag-border",
  "--nc-tags-input-clear-text",
  "--nc-tags-input-focus-ring",
  "--nc-tags-input-radius",
  "--nc-tags-input-padding",
  "--nc-tags-input-gap",
  "--nc-tags-input-min-height"
] as const;

export type NcTagsInputTokenName = (typeof ncTagsInputTokenNames)[number];