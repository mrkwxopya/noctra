import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcFloatLabelVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcFloatLabelPlacement = "inside" | "outside";

export interface FloatLabelProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "htmlFor" | "label" | "readOnly" | "required" | "size" | "style"> {
  children?: ReactNode;
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  successMessage?: ReactNode;
  warningMessage?: ReactNode;
  htmlFor?: string;
  active?: boolean;
  variant?: NcFloatLabelVariant;
  placement?: NcFloatLabelPlacement;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: FloatLabelStyle;
}

export type FloatLabelStyle = CSSProperties;
