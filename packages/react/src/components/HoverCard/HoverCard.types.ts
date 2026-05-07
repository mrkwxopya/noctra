import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcHoverCardVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcHoverCardPlacement = "top" | "right" | "bottom" | "left";
export type NcHoverCardAlign = "start" | "center" | "end";
export type NcHoverCardWidth = "auto" | "xs" | "sm" | "md" | "lg";

export interface HoverCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "align" | "children" | "content" | "disabled" | "media" | "size" | "style" | "title" | "width"> {
  children?: ReactNode;
  triggerContent?: ReactNode;
  content?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  media?: ReactNode;
  footer?: ReactNode;
  opened?: boolean;
  defaultOpened?: boolean;
  onOpenChange?: (opened: boolean) => void;
  variant?: NcHoverCardVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  placement?: NcHoverCardPlacement;
  align?: NcHoverCardAlign;
  width?: NcHoverCardWidth;
  withArrow?: boolean;
  withBorder?: boolean;
  keepMounted?: boolean;
  offset?: number;
  openDelay?: number;
  closeDelay?: number;
  interactive?: boolean;
  triggerButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;
  style?: HoverCardStyle;
}

export type HoverCardStyle = CSSProperties & {
  "--nc-hover-card-offset"?: string;
};
