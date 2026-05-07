import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcInlineCodeVariant = "surface" | "soft" | "outline" | "filled" | "ghost";

export interface InlineCodeProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "disabled" | "prefix" | "size" | "style" | "title" | "value"> {
  children?: ReactNode;
  value?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  language?: string;
  title?: string;
  variant?: NcInlineCodeVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  truncate?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: InlineCodeStyle;
}

export type InlineCodeStyle = CSSProperties;
