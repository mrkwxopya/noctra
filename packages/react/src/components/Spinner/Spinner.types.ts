import type { HTMLAttributes, ReactNode } from "react";
import type { NcSize, NcTone } from "../../shared/system.types";

export type NcSpinnerVariant = "default" | "subtle" | "primary" | "neutral";

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: NcSpinnerVariant;
  size?: NcSize;
  tone?: NcTone;
  label?: ReactNode;
}