export const nativeSelectAnatomy = [
  "root",
  "wrapper",
  "field",
  "label",
  "description",
  "error",
  "arrow",
  "loader"
] as const;

export type NativeSelectSlot = (typeof nativeSelectAnatomy)[number];