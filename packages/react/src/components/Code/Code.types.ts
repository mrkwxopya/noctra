import type { HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcCodeVariant = "surface" | "soft" | "outline" | "filled" | "ghost";

export interface CodeProps extends HTMLAttributes<HTMLElement> {
  variant?: NcCodeVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
}

export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLPreElement>, "children" | "label" | "size" | "wrap"> {
  code?: string;
  children?: ReactNode;
  language?: string;
  label?: ReactNode;
  description?: ReactNode;
  variant?: NcCodeVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  withHeader?: boolean;
  withLineNumbers?: boolean;
  wrap?: boolean;
  highlightedLines?: number[];
}
