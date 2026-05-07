import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcProgressVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcProgressMode = "line" | "circle";
export type NcProgressLabelPosition = "inside" | "outside" | "none";

export interface ProgressSection {
  value: number;
  label?: ReactNode;
  tone?: NcTone;
  title?: string;
}

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "label" | "max" | "min" | "onChange" | "required" | "size" | "style" | "value"> {
  children?: ReactNode;
  value?: number;
  defaultValue?: number;
  max?: number;
  min?: number;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  valueLabel?: ReactNode;
  formatValue?: (value: number, max: number, percent: number) => ReactNode;
  sections?: ProgressSection[];
  mode?: NcProgressMode;
  labelPosition?: NcProgressLabelPosition;
  variant?: NcProgressVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  indeterminate?: boolean;
  striped?: boolean;
  animated?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: ProgressStyle;
}

export type ProgressStyle = CSSProperties & {
  "--nc-progress-value"?: string;
  "--nc-progress-size"?: string;
  "--nc-progress-circle-size"?: string;
  "--nc-progress-circle-dash"?: string;
  "--nc-progress-circle-offset"?: string;
};
