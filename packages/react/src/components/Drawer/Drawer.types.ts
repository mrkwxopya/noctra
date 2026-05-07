import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcDrawerVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcDrawerPlacement = "left" | "right" | "top" | "bottom";
export type NcDrawerWidth = "xs" | "sm" | "md" | "lg" | "xl" | "full";

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "onClose" | "size" | "title" | "width"> {
  children?: ReactNode;
  opened?: boolean;
  defaultOpened?: boolean;
  onOpenChange?: (opened: boolean) => void;
  onClose?: () => void;
  title?: ReactNode;
  description?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  actions?: ReactNode;
  closeLabel?: string;
  closeButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;
  variant?: NcDrawerVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  width?: NcDrawerWidth;
  placement?: NcDrawerPlacement;
  withOverlay?: boolean;
  withCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  lockScroll?: boolean;
  trapFocus?: boolean;
  fullScreen?: boolean;
  withBorder?: boolean;
  keepMounted?: boolean;
  ariaLabel?: string;
}
