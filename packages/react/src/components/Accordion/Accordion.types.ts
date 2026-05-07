import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcAccordionVariant = "surface" | "soft" | "outline" | "filled" | "ghost" | "separated";
export type NcAccordionChevronPosition = "left" | "right";
export type NcAccordionValue = string | string[];

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "disabled" | "loop" | "multiple" | "onChange" | "size" | "value"> {
  children?: ReactNode;
  value?: NcAccordionValue;
  defaultValue?: NcAccordionValue;
  onValueChange?: (value: NcAccordionValue) => void;
  variant?: NcAccordionVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  multiple?: boolean;
  collapsible?: boolean;
  keepMounted?: boolean;
  chevronPosition?: NcAccordionChevronPosition;
  withBorder?: boolean;
  fullWidth?: boolean;
  loop?: boolean;
  ariaLabel?: string;
}

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "title" | "value"> {
  children?: ReactNode;
  value: string;
  disabled?: boolean;
  tone?: NcTone;
}

export interface AccordionControlProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "label" | "value"> {
  children?: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  rightSection?: ReactNode;
  chevron?: ReactNode;
}

export interface AccordionPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children?: ReactNode;
  forceMount?: boolean;
  padded?: boolean;
}
