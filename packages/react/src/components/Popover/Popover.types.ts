import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcPopoverVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcPopoverPlacement = "top" | "right" | "bottom" | "left";
export type NcPopoverAlign = "start" | "center" | "end";
export type NcPopoverTrigger = "click" | "hover" | "focus" | "manual";
export type NcPopoverWidth = "auto" | "xs" | "sm" | "md" | "lg" | "full";

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, "align" | "children" | "content" | "disabled" | "size" | "title" | "width"> {
  children?: ReactNode;
  triggerContent?: ReactNode;
  content?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  opened?: boolean;
  defaultOpened?: boolean;
  onOpenChange?: (opened: boolean) => void;
  variant?: NcPopoverVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  placement?: NcPopoverPlacement;
  align?: NcPopoverAlign;
  trigger?: NcPopoverTrigger;
  width?: NcPopoverWidth;
  withArrow?: boolean;
  withBorder?: boolean;
  withCloseButton?: boolean;
  closeLabel?: string;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  keepMounted?: boolean;
  offset?: number;
  triggerButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;
  closeButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;
}
