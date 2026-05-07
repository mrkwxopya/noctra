export const footerAnatomy = [
  "root",
  "inner",
  "brand",
  "logo",
  "brand-content",
  "title",
  "description",
  "sections",
  "section",
  "section-title",
  "section-description",
  "links",
  "link",
  "link-icon",
  "link-content",
  "link-label",
  "link-description",
  "actions",
  "bottom",
  "copyright",
  "meta"
] as const;

export type FooterSlot = (typeof footerAnatomy)[number];