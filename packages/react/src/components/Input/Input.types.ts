import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize } from "../../shared/system.types";

export type NcInputVariant = "outline" | "surface" | "filled" | "flushed" | "unstyled";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "label" | "loading" | "size"> {
  variant?: NcInputVariant;
  size?: NcSize;
  radius?: NcRadius;
  density?: NcDensity;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  invalid?: boolean;
  valid?: boolean;
  loading?: boolean;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  rootProps?: HTMLAttributes<HTMLDivElement>;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
}
