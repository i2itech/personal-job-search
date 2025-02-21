export enum StringFormat {
  SNAKE_CASE = "snake_case",
}

export function formatString(str: string, format: StringFormat) {
  switch (format) {
    case StringFormat.SNAKE_CASE:
      return str
        .toLowerCase()
        .replace(/\s+/g, "_") // Replace one or more spaces with single underscore
        .replace(/^_/, ""); // Remove leading underscore if present
  }
}
