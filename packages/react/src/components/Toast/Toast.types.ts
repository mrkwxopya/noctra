import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcToastVariant = "surface" | "soft" | "filled" | "outline" | "ghost";
export type NcToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastAction {
  label: ReactNode;
  onClick?: () => void;
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick">;
}

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "action" | "role" | "size" | "title"> {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ToastAction;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  variant?: NcToastVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  position?: NcToastPosition;
  duration?: number | null;
  withCloseButton?: boolean;
  closeLabel?: string;
  role?: "status" | "alert";
}
