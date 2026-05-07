import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcScrollAreaVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcScrollAreaScrollbar = "auto" | "always" | "hover" | "hidden";
export type NcScrollAreaOverscroll = "auto" | "contain" | "none";

export interface ScrollAreaProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "height" | "size" | "style" | "width"> {
  children?: ReactNode;
  variant?: NcScrollAreaVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  scrollbar?: NcScrollAreaScrollbar;
  overscroll?: NcScrollAreaOverscroll;
  maxHeight?: number | string;
  maxWidth?: number | string;
  height?: number | string;
  width?: number | string;
  padded?: boolean;
  withBorder?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  horizontal?: boolean;
  vertical?: boolean;
  scrollPadding?: number | string;
  style?: ScrollAreaStyle;
}

export type ScrollAreaStyle = CSSProperties & {
  "--nc-scroll-area-max-height"?: string;
  "--nc-scroll-area-max-width"?: string;
  "--nc-scroll-area-height"?: string;
  "--nc-scroll-area-width"?: string;
  "--nc-scroll-area-padding"?: string;
};
