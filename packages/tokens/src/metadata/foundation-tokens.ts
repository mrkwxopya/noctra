import type { NcTokenMeta } from "./types";

export const ncFoundationTokenMeta: NcTokenMeta[] = [
  {
    name: "Background Page",
    cssVariable: "--nc-bg-page",
    category: "background",
    mode: "semantic",
    role: "Root application background.",
    description: "The base canvas used behind application shells, docs pages, and dashboard layouts."
  },
  {
    name: "Background Surface",
    cssVariable: "--nc-bg-surface",
    category: "background",
    mode: "semantic",
    role: "Standard component surface.",
    description: "Used by cards, panels, inputs, and normal UI containers."
  },
  {
    name: "Background Elevated",
    cssVariable: "--nc-bg-elevated",
    category: "background",
    mode: "semantic",
    role: "Emphasized surface.",
    description: "Used by raised cards and panels that need stronger visual hierarchy."
  },
  {
    name: "Border Default",
    cssVariable: "--nc-border-default",
    category: "border",
    mode: "semantic",
    role: "Readable default border.",
    description: "Used by inputs and normal containers that need clear separation."
  },
  {
    name: "Border Focus",
    cssVariable: "--nc-border-focus",
    category: "border",
    mode: "semantic",
    role: "Keyboard focus border.",
    description: "Pairs with the focus ring to create accessible but polished focus states."
  },
  {
    name: "Text Primary",
    cssVariable: "--nc-text-primary",
    category: "text",
    mode: "semantic",
    role: "Primary readable text.",
    description: "Used for headings, important labels, and primary UI copy."
  },
  {
    name: "Text Muted",
    cssVariable: "--nc-text-muted",
    category: "text",
    mode: "semantic",
    role: "Secondary low-emphasis text.",
    description: "Used for descriptions, helper text, metadata, and subdued docs content."
  },
  {
    name: "Shadow Card",
    cssVariable: "--nc-shadow-card",
    category: "shadow",
    mode: "semantic",
    role: "Standard card elevation.",
    description: "Provides a subtle premium elevation for surfaces without creating noisy UI."
  },
  {
    name: "Focus Ring",
    cssVariable: "--nc-state-focus-ring",
    category: "state",
    mode: "state",
    role: "Accessible focus indication.",
    description: "Used by interactive components to provide a consistent keyboard focus treatment."
  }
];