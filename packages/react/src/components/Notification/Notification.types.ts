import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcNotificationVariant = "surface" | "soft" | "filled" | "outline" | "ghost";

export interface NotificationAction {
  label: ReactNode;
  onClick?: () => void;
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick">;
}

export interface NotificationProps extends Omit<HTMLAttributes<HTMLDivElement>, "action" | "children" | "role" | "size" | "title"> {
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  icon?: ReactNode;
  action?: NotificationAction;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  variant?: NcNotificationVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  withCloseButton?: boolean;
  closeLabel?: string;
  role?: "status" | "alert" | "note";
}
