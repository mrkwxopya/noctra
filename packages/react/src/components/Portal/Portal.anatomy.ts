export const portalAnatomy = [
  "root"
] as const;

export type PortalSlot = (typeof portalAnatomy)[number];