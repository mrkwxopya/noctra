import type { HTMLAttributes, ReactNode } from "react";
import type { NcRadius } from "../../shared/system.types";

export type NcAvatarVariant = "image" | "initials" | "icon" | "surface";
export type NcAvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type NcAvatarStatus = "online" | "offline" | "busy" | "away";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  fallback?: ReactNode;
  icon?: ReactNode;
  variant?: NcAvatarVariant;
  size?: NcAvatarSize;
  radius?: NcRadius;
  status?: NcAvatarStatus;
}