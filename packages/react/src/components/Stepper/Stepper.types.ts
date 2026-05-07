import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcStepperVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcStepperOrientation = "horizontal" | "vertical";
export type NcStepperStepStatus = "idle" | "active" | "completed" | "error" | "disabled";

export interface StepperStep {
  value: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  completedIcon?: ReactNode;
  errorIcon?: ReactNode;
  badge?: ReactNode;
  tone?: NcTone;
  status?: NcStepperStepStatus;
  disabled?: boolean;
}

export interface StepperProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "label" | "onChange" | "onSelect" | "readOnly" | "required" | "size" | "style" | "value"> {
  children?: ReactNode;
  steps?: StepperStep[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  onStepSelect?: (step: StepperStep) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  emptyMessage?: ReactNode;
  variant?: NcStepperVariant;
  orientation?: NcStepperOrientation;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  selectable?: boolean;
  allowCompletedSelect?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;
  style?: StepperStyle;
}

export type StepperStyle = CSSProperties;
