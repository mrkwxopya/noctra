import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcPortalVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type PortalContainer = Element | DocumentFragment | null | (() => Element | DocumentFragment | null);

export interface PortalProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "size" | "style"> {
  children?: ReactNode;
  container?: PortalContainer;
  disabled?: boolean;
  forceMount?: boolean;
  preserveWrapper?: boolean;
  portalKey?: string;
  variant?: NcPortalVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: PortalStyle;
}

export type PortalStyle = CSSProperties;
