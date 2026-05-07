import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcHighlightVariant = "surface" | "soft" | "outline" | "filled" | "ghost";

export interface HighlightProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "disabled" | "size" | "style"> {
  children?: ReactNode;
  text?: string;
  query?: string | string[];
  caseSensitive?: boolean;
  wholeWords?: boolean;
  maxMatches?: number;
  emptyFallback?: ReactNode;
  variant?: NcHighlightVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: HighlightStyle;
}

export type HighlightStyle = CSSProperties;
