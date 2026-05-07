export const ncSpaceTokens = [
  "--nc-space-0",
  "--nc-space-1",
  "--nc-space-2",
  "--nc-space-3",
  "--nc-space-4",
  "--nc-space-5",
  "--nc-space-6",
  "--nc-space-8",
  "--nc-space-10",
  "--nc-space-12",
  "--nc-space-16",
  "--nc-space-20",
  "--nc-space-24"
] as const;

export type NcSpaceToken = (typeof ncSpaceTokens)[number];