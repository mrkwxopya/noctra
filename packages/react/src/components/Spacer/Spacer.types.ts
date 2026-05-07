import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcSpacerVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcSpacerAxis = "horizontal" | "vertical" | "both";
export type NcSpacerPreset = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface SpacerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "size" | "style"> {
  children?: ReactNode;
  axis?: NcSpacerAxis;
  space?: number | string;
  inlineSize?: number | string;
  blockSize?: number | string;
  preset?: NcSpacerPreset;
  grow?: boolean | number;
  shrink?: boolean | number;
  decorative?: boolean;
  variant?: NcSpacerVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: SpacerStyle;
}

export type SpacerStyle = CSSProperties & {
  "--nc-spacer-space"?: string;
  "--nc-spacer-inline-size"?: string;
  "--nc-spacer-block-size"?: string;
  "--nc-spacer-grow"?: string;
  "--nc-spacer-shrink"?: string;
};
