export enum StringFormat {
  SNAKE_CASE = "snake_case",
}

export function formatString(str: string, format: StringFormat) {
  switch (format) {
    case StringFormat.SNAKE_CASE:
      return str
        .replace(/\s+/g, "_") // Replace one or more spaces with single underscore
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()
        .replace(/^_/, "") // Remove leading underscore if present
        .replace(/_+/g, "_"); // Replace multiple underscores with a single underscore
  }
}
