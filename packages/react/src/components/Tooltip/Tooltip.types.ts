import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcTooltipVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcTooltipPlacement = "top" | "right" | "bottom" | "left";
export type NcTooltipAlign = "start" | "center" | "end";
export type NcTooltipTrigger = "hover" | "focus" | "click" | "manual";
export type NcTooltipWidth = "auto" | "xs" | "sm" | "md";

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "align" | "children" | "content" | "disabled" | "label" | "size" | "style" | "width"> {
  children?: ReactNode;
  triggerContent?: ReactNode;
  content?: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  opened?: boolean;
  defaultOpened?: boolean;
  onOpenChange?: (opened: boolean) => void;
  variant?: NcTooltipVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  placement?: NcTooltipPlacement;
  align?: NcTooltipAlign;
  trigger?: NcTooltipTrigger;
  width?: NcTooltipWidth;
  withArrow?: boolean;
  withBorder?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  keepMounted?: boolean;
  offset?: number;
  openDelay?: number;
  closeDelay?: number;
  multiline?: boolean;
  triggerButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;
  style?: TooltipStyle;
}

export type TooltipStyle = CSSProperties & {
  "--nc-tooltip-offset"?: string;
};
