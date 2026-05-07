export const splitPaneAnatomy = [
  "root",
  "pane",
  "primary",
  "secondary",
  "handle",
  "handle-hitbox"
] as const;

export type SplitPaneSlot = (typeof splitPaneAnatomy)[number];