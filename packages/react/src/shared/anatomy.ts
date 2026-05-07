export const ncCommonSlots = [
  "root",
  "wrapper",
  "inner",
  "header",
  "body",
  "footer",
  "content",
  "label",
  "description",
  "icon",
  "indicator",
  "control",
  "trigger",
  "panel",
  "item",
  "separator",
  "action",
  "loader",
  "error",
  "hint"
] as const;

export type NcCommonSlot = (typeof ncCommonSlots)[number];

export function ncSlot(slot: string): { "data-slot": string } {
  return { "data-slot": slot };
}