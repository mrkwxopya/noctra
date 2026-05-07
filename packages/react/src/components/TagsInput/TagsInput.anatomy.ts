export const tagsInputAnatomy = [
  "root",
  "label",
  "description",
  "control",
  "values",
  "tag",
  "tag-icon",
  "tag-label",
  "tag-remove",
  "input",
  "clear",
  "message"
] as const;

export type TagsInputSlot = (typeof tagsInputAnatomy)[number];