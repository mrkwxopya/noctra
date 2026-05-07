export const formFieldAnatomy = ["root", "label", "required", "description", "control", "hint", "error", "message"] as const;

export type FormFieldSlot = (typeof formFieldAnatomy)[number];