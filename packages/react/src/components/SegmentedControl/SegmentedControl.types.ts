import type { HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcSegmentedControlVariant = "solid" | "soft" | "surface" | "outline";
export type NcSegmentedControlOrientation = "horizontal" | "vertical";

export interface SegmentedControlOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "disabled" | "label" | "name" | "onChange" | "readOnly" | "required" | "size" | "value"> {
  options: SegmentedControlOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, option: SegmentedControlOption) => void;
  variant?: NcSegmentedControlVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  orientation?: NcSegmentedControlOrientation;
  fullWidth?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  name?: string;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
}
