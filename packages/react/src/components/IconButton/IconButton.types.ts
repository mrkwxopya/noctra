import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcIconButtonVariant = "solid" | "soft" | "outline" | "ghost" | "subtle" | "surface";

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "label" | "loading" | "selected" | "size"> {
  label: string;
  icon: ReactNode;
  variant?: NcIconButtonVariant;
  size?: NcSize;
  tone?: NcTone;
  radius?: NcRadius;
  density?: NcDensity;
  loading?: boolean;
  selected?: boolean;
}
