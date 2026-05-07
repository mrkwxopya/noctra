export const buttonDoc = {
  name: "Button",
  status: "stable-draft",
  description:
    "Button is used to trigger actions, submit forms, open dialogs, or move users through a workflow.",
  importCode: 'import { Button } from "@noctra/react";',
  anatomy: [
    { slot: "root", description: "The native button element.", dataSlot: "root" },
    { slot: "icon", description: "Left or right icon container.", dataSlot: "icon" },
    { slot: "label", description: "The visible button label.", dataSlot: "label" },
    { slot: "loader", description: "Loading indicator shown during pending actions.", dataSlot: "loader" }
  ],
  props: [
    { prop: "variant", type: '"solid" | "soft" | "outline" | "ghost" | "subtle" | "surface" | "link"', defaultValue: '"solid"', description: "Visual button variant." },
    { prop: "tone", type: '"neutral" | "primary" | "success" | "danger" | "warning" | "info"', defaultValue: '"primary"', description: "Semantic action tone." },
    { prop: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', defaultValue: '"md"', description: "Button size." },
    { prop: "radius", type: '"none" | "sm" | "md" | "lg" | "xl" | "full"', defaultValue: '"md"', description: "Button radius." },
    { prop: "density", type: '"compact" | "default" | "comfortable"', defaultValue: '"default"', description: "Density mode." },
    { prop: "loading", type: "boolean", defaultValue: "false", description: "Shows a loader and disables duplicate actions." },
    { prop: "disabled", type: "boolean", defaultValue: "false", description: "Disables the button." },
    { prop: "fullWidth", type: "boolean", defaultValue: "false", description: "Expands the button to full width." }
  ],
  cssVariables: [
    { token: "--nc-button-bg", purpose: "Button background.", slot: "root" },
    { token: "--nc-button-bg-hover", purpose: "Button hover background.", slot: "root" },
    { token: "--nc-button-bg-active", purpose: "Button active background.", slot: "root" },
    { token: "--nc-button-text", purpose: "Button text color.", slot: "label" },
    { token: "--nc-button-border", purpose: "Button border color.", slot: "root" },
    { token: "--nc-button-shadow", purpose: "Button elevation shadow.", slot: "root" },
    { token: "--nc-button-radius", purpose: "Button radius.", slot: "root" },
    { token: "--nc-button-height", purpose: "Button height.", slot: "root" },
    { token: "--nc-button-padding-x", purpose: "Horizontal padding.", slot: "root" },
    { token: "--nc-button-gap", purpose: "Gap between icon, label, and loader.", slot: "root" }
  ],
  dataAttributes: [
    { attribute: "data-slot", values: "root | icon | label | loader", purpose: "Identifies component anatomy slots." },
    { attribute: "data-variant", values: "solid | soft | outline | ghost | subtle | surface | link", purpose: "Controls visual variant." },
    { attribute: "data-size", values: "xs | sm | md | lg | xl", purpose: "Controls button size." },
    { attribute: "data-tone", values: "neutral | primary | success | danger | warning | info", purpose: "Controls semantic tone." },
    { attribute: "data-loading", values: "true", purpose: "Marks loading state." },
    { attribute: "data-disabled", values: "true", purpose: "Marks disabled state." }
  ],
  accessibility: [
    "Use a native button element for actions.",
    "Use a link component for navigation.",
    "Loading state should prevent duplicate actions.",
    "Icon-only buttons must include an accessible label.",
    "Danger actions should be visually clear without being aggressive."
  ]
} as const;