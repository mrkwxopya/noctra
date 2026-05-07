import type { HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcHeaderVariant = "surface" | "soft" | "outline" | "filled" | "ghost";
export type NcHeaderPosition = "static" | "sticky" | "fixed";

export interface HeaderProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "disabled" | "size" | "title"> {
  children?: ReactNode;
  logo?: ReactNode;
  brand?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  navigation?: ReactNode;
  toolbar?: ReactNode;
  actions?: ReactNode;
  startSection?: ReactNode;
  endSection?: ReactNode;
  variant?: NcHeaderVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  position?: NcHeaderPosition;
  disabled?: boolean;
  withBorder?: boolean;
  transparent?: boolean;
  compact?: boolean;
}
