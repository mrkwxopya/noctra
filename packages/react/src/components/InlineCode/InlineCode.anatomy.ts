export const inlineCodeAnatomy = [
  "root",
  "prefix",
  "value",
  "suffix",
  "language"
] as const;

export type InlineCodeSlot = (typeof inlineCodeAnatomy)[number];