export const tabsAnatomy = [
  "root",
  "list",
  "tab",
  "tab-icon",
  "tab-content",
  "tab-label",
  "tab-description",
  "tab-badge",
  "tab-right-section",
  "panels",
  "panel"
] as const;

export type TabsSlot = (typeof tabsAnatomy)[number];