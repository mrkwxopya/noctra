export const ncDropzoneTokenNames = [
  "--nc-dropzone-bg",
  "--nc-dropzone-border",
  "--nc-dropzone-text",
  "--nc-dropzone-muted-text",
  "--nc-dropzone-zone-bg",
  "--nc-dropzone-zone-bg-hover",
  "--nc-dropzone-zone-bg-accept",
  "--nc-dropzone-zone-bg-reject",
  "--nc-dropzone-icon-bg",
  "--nc-dropzone-icon-text",
  "--nc-dropzone-browse-bg",
  "--nc-dropzone-browse-text",
  "--nc-dropzone-focus-ring",
  "--nc-dropzone-radius",
  "--nc-dropzone-gap",
  "--nc-dropzone-min-height"
] as const;

export type NcDropzoneTokenName = (typeof ncDropzoneTokenNames)[number];