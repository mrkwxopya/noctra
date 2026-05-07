import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcButtonVariant = "solid" | "soft" | "outline" | "ghost" | "subtle" | "surface" | "link";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: NcButtonVariant;
  size?: NcSize;
  tone?: NcTone;
  radius?: NcRadius;
  density?: NcDensity;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}