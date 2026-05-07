import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcEmptyStateVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcEmptyStateAlign = "left" | "center" | "right";

export interface EmptyStateAction {
  label: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick">;
  anchorProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href" | "target" | "rel">;
}

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "action" | "align" | "children" | "disabled" | "media" | "size" | "style" | "title"> {
  children?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  media?: ReactNode;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  footer?: ReactNode;
  align?: NcEmptyStateAlign;
  variant?: NcEmptyStateVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  compact?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: EmptyStateStyle;
}

export type EmptyStateStyle = CSSProperties;
