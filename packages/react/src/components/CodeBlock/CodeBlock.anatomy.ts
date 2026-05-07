export const codeBlockAnatomy = [
  "root",
  "header",
  "title",
  "description",
  "filename",
  "language",
  "meta",
  "copy",
  "copy-icon",
  "body",
  "pre",
  "code",
  "line",
  "line-number",
  "line-content",
  "footer"
] as const;

export type CodeBlockSlot = (typeof codeBlockAnatomy)[number];