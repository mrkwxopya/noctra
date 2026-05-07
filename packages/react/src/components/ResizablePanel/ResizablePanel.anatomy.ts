export const resizablePanelAnatomy = [
  "group",
  "panel",
  "handle",
  "handle-hitbox"
] as const;

export type ResizablePanelSlot = (typeof resizablePanelAnatomy)[number];