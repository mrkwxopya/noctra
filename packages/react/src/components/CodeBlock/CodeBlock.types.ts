import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { NcDensity, NcRadius, NcSize, NcTone } from "../../shared/system.types";

export type NcCodeBlockVariant = "surface" | "soft" | "outline" | "filled" | "ghost";

export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "disabled" | "size" | "style" | "title"> {
  children?: ReactNode;
  code?: string;
  title?: ReactNode;
  description?: ReactNode;
  language?: string;
  filename?: ReactNode;
  meta?: ReactNode;
  footer?: ReactNode;
  copyLabel?: ReactNode;
  copiedLabel?: ReactNode;
  copyText?: string;
  onCopied?: (value: string) => void;
  onCopyError?: (error: unknown) => void;
  showCopy?: boolean;
  showLineNumbers?: boolean;
  startLine?: number;
  highlightedLines?: number[];
  maxHeight?: number | string;
  variant?: NcCodeBlockVariant;
  size?: Exclude<NcSize, "xl">;
  radius?: NcRadius;
  tone?: NcTone;
  density?: NcDensity;
  disabled?: boolean;
  fullWidth?: boolean;
  withBorder?: boolean;
  preProps?: Omit<HTMLAttributes<HTMLPreElement>, "children">;
  codeProps?: Omit<HTMLAttributes<HTMLElement>, "children">;
  buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;
  style?: CodeBlockStyle;
}

export type CodeBlockStyle = CSSProperties & {
  "--nc-code-block-max-height"?: string;
};
