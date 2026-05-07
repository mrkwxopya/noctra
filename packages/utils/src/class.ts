export function ncCx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function ncBoolAttr(value: boolean | undefined): true | undefined {
  return value ? true : undefined;
}
