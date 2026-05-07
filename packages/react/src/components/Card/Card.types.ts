import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcCardVariant = "surface" | "soft" | "outline" | "filled" | "ghost" | "elevated" | "subtle" | "interactive";
export type NcCardOrientation = "vertical" | "horizontal";
export type NcCardShadow = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export interface CardAction {
  label: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick">;
  anchorProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href" | "target" | "rel">;
}

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "media" | "muted" | "selected" | "size" | "style" | "title" | "width"> {
  children?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  media?: ReactNode;
  image?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  aside?: ReactNode;
  actions?: ReactNode;
  primaryAction?: CardAction;
  secondaryAction?: CardAction;
  orientation?: NcCardOrientation;
  shadow?: NcCardShadow;
  interactive?: boolean;
  selected?: boolean;
  muted?: boolean;
  padded?: boolean;
  width?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  variant?: NcCardVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: CardStyle;
}

export type CardStyle = CSSProperties & {
  "--nc-card-width"?: string;
  "--nc-card-min-height"?: string;
  "--nc-card-max-width"?: string;
};
export interface CardPartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "style" | "title"> {
  children?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  style?: CSSProperties;
}
