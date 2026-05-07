import type { HTMLAttributes, ReactNode } from "react";
import type { NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcBadgeVariant = "solid" | "soft" | "outline" | "subtle" | "dot" | "surface";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: NcBadgeVariant;
  tone?: NcTone;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  dot?: boolean;
}