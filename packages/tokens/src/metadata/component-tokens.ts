import type { NcTokenMeta } from "./types";

export const ncComponentTokenMeta: NcTokenMeta[] = [
  {
    name: "Button Background",
    cssVariable: "--nc-button-bg",
    category: "component",
    mode: "component",
    role: "Button root background.",
    description: "Controls the default background for the Button component."
  },
  {
    name: "Button Text",
    cssVariable: "--nc-button-text",
    category: "component",
    mode: "component",
    role: "Button label color.",
    description: "Controls the foreground text and icon color for the Button component."
  },
  {
    name: "Button Border",
    cssVariable: "--nc-button-border",
    category: "component",
    mode: "component",
    role: "Button root border.",
    description: "Controls the Button border color across variants and tones."
  },
  {
    name: "Card Background",
    cssVariable: "--nc-card-bg",
    category: "component",
    mode: "component",
    role: "Card root background.",
    description: "Controls the surface used by the Card component."
  },
  {
    name: "Card Border",
    cssVariable: "--nc-card-border",
    category: "component",
    mode: "component",
    role: "Card border.",
    description: "Controls the subtle separation around Card surfaces."
  },
  {
    name: "Input Background",
    cssVariable: "--nc-input-bg",
    category: "component",
    mode: "component",
    role: "Input wrapper background.",
    description: "Controls the Input field wrapper surface."
  },
  {
    name: "Input Border Focus",
    cssVariable: "--nc-input-border-focus",
    category: "component",
    mode: "component",
    role: "Input focus border.",
    description: "Controls the focused border state for Input."
  },
  {
    name: "Badge Background",
    cssVariable: "--nc-badge-bg",
    category: "component",
    mode: "component",
    role: "Badge root background.",
    description: "Controls the Badge background across variants and tones."
  },
  {
    name: "Alert Background",
    cssVariable: "--nc-alert-bg",
    category: "component",
    mode: "component",
    role: "Alert root background.",
    description: "Controls semantic message surfaces for Alert."
  },
  {
    name: "Modal Background",
    cssVariable: "--nc-modal-bg",
    category: "component",
    mode: "component",
    role: "Modal content background.",
    description: "Controls the elevated overlay surface for Modal content."
  }
];