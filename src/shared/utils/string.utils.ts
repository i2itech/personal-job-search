export enum StringFormat {
  SNAKE_CASE = "snake_case",
}

export const StringRegex = {
  SPECIAL_CHARACTERS: /[^\w\s]/g,
  MULTIPLE_UNDERSCORES: /_+/g,
  MULTIPLE_SPACES: /\s+/g,
};

export function formatString(str: string, format: StringFormat) {
  switch (format) {
    case StringFormat.SNAKE_CASE:
      return str.toLowerCase().replace(StringRegex.MULTIPLE_SPACES, "_").replace(StringRegex.MULTIPLE_UNDERSCORES, "_");
  }
}
