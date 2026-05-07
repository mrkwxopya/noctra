import type { HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius } from "../../shared/system.types";

export type NcAlertVariant = "solid" | "soft" | "surface" | "outline" | "subtle";
export type NcAlertTone = "info" | "success" | "warning" | "danger" | "neutral";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "action" | "title"> {
  variant?: NcAlertVariant;
  tone?: NcAlertTone;
  radius?: NcRadius;
  density?: NcDensity;
  title?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
}
