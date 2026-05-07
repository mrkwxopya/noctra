import type { ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "./system.types";

export interface NcBaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface NcStyledComponentProps {
  size?: NcSize;
  tone?: NcTone;
  radius?: NcRadius;
  density?: NcDensity;
}

export interface NcLoadingComponentProps {
  loading?: boolean;
  disabled?: boolean;
}

export interface NcValidationComponentProps {
  invalid?: boolean;
  valid?: boolean;
  required?: boolean;
}