import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcSliderVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcSliderOrientation = "horizontal" | "vertical";
export type NcSliderValuePlacement = "top" | "bottom" | "inline";

export interface SliderMark {
  value: number;
  label?: ReactNode;
}

export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "label" | "max" | "min" | "onChange" | "readOnly" | "required" | "size" | "step" | "style" | "value"> {
  children?: ReactNode;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  min?: number;
  max?: number;
  step?: number;
  marks?: SliderMark[];
  formatValue?: (value: number) => ReactNode;
  valueLabel?: ReactNode;
  thumbLabel?: string;
  trackLabel?: string;
  variant?: NcSliderVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  inverted?: boolean;
  showValue?: boolean;
  showMarks?: boolean;
  showTrackLabels?: boolean;
  orientation?: NcSliderOrientation;
  valuePlacement?: NcSliderValuePlacement;
  fullWidth?: boolean;
  withBorder?: boolean;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "type" | "value" | "defaultValue">;
  style?: SliderStyle;
}

export type SliderStyle = CSSProperties & {
  "--nc-slider-progress"?: string;
  "--nc-slider-progress-start"?: string;
  "--nc-slider-progress-end"?: string;
};
