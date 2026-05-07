import type { CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcRangeSliderVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcRangeSliderOrientation = "horizontal" | "vertical";
export type NcRangeSliderValuePlacement = "top" | "bottom" | "inline";
export type RangeSliderValue = [number, number];

export interface RangeSliderMark {
  value: number;
  label?: ReactNode;
}

export interface RangeSliderProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "label" | "max" | "min" | "onChange" | "readOnly" | "required" | "size" | "step" | "style" | "value"> {
  children?: ReactNode;
  value?: RangeSliderValue;
  defaultValue?: RangeSliderValue;
  onValueChange?: (value: RangeSliderValue) => void;
  onValueCommit?: (value: RangeSliderValue) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  min?: number;
  max?: number;
  step?: number;
  minRange?: number;
  marks?: RangeSliderMark[];
  formatValue?: (value: number) => ReactNode;
  valueLabel?: ReactNode;
  startThumbLabel?: string;
  endThumbLabel?: string;
  trackLabel?: string;
  variant?: NcRangeSliderVariant;
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
  orientation?: NcRangeSliderOrientation;
  valuePlacement?: NcRangeSliderValuePlacement;
  fullWidth?: boolean;
  withBorder?: boolean;
  startInputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "type" | "value" | "defaultValue">;
  endInputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "type" | "value" | "defaultValue">;
  style?: RangeSliderStyle;
}

export type RangeSliderStyle = CSSProperties & {
  "--nc-range-slider-start"?: string;
  "--nc-range-slider-end"?: string;
  "--nc-range-slider-mark-progress"?: string;
};
