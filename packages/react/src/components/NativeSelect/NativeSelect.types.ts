import type { HTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import type { NcDensity, NcRadius, NcSize } from "../../shared/system.types";

export type NcNativeSelectVariant = "outline" | "surface" | "filled" | "flushed" | "unstyled";

export interface NativeSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "label" | "loading" | "placeholder" | "readOnly" | "size"> {
  variant?: NcNativeSelectVariant;
  size?: NcSize;
  radius?: NcRadius;
  density?: NcDensity;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  placeholder?: ReactNode;
  invalid?: boolean;
  valid?: boolean;
  loading?: boolean;
  readOnly?: boolean;
  rootProps?: HTMLAttributes<HTMLDivElement>;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
}
