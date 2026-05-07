import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcRatingVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcRatingPrecision = 0.5 | 1;

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "label" | "max" | "onChange" | "readOnly" | "required" | "size" | "style" | "value"> {
  children?: ReactNode;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  onHoverChange?: (value: number | null) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  emptyMessage?: ReactNode;
  icon?: ReactNode;
  emptyIcon?: ReactNode;
  getItemLabel?: (value: number, max: number) => string;
  max?: number;
  precision?: NcRatingPrecision;
  variant?: NcRatingVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  allowClear?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: RatingStyle;
}

export type RatingStyle = CSSProperties & {
  "--nc-rating-max"?: string;
};
