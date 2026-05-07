export type NcTokenCategory =
  | "color"
  | "background"
  | "text"
  | "border"
  | "action"
  | "state"
  | "surface"
  | "radius"
  | "spacing"
  | "typography"
  | "shadow"
  | "motion"
  | "z-index"
  | "component";

export type NcTokenMode = "primitive" | "semantic" | "theme" | "component" | "variant" | "state" | "utility";

export interface NcTokenMeta {
  name: string;
  cssVariable: string;
  category: NcTokenCategory;
  mode: NcTokenMode;
  role: string;
  description: string;
}