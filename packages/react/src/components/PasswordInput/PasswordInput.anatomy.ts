export const passwordInputAnatomy = [
  "root",
  "label",
  "description",
  "control",
  "left-section",
  "prefix",
  "input",
  "suffix",
  "clear",
  "reveal",
  "right-section",
  "strength",
  "strength-bar",
  "strength-label",
  "message"
] as const;

export type PasswordInputSlot = (typeof passwordInputAnatomy)[number];