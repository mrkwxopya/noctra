import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcScrollLockVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcScrollLockTarget = "body" | "documentElement";

export interface ScrollLockProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "size" | "style" | "target"> {
  children?: ReactNode;
  active?: boolean;
  target?: NcScrollLockTarget;
  reserveScrollbarGap?: boolean;
  preventTouchMove?: boolean;
  allowTouchMove?: (target: EventTarget | null) => boolean;
  variant?: NcScrollLockVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  style?: ScrollLockStyle;
}

export type ScrollLockStyle = CSSProperties;
