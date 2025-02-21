import { formatString, StringFormat } from "./string.utils";

describe("String Utils", () => {
  describe("formatString with SNAKE_CASE", () => {
    it("should convert camelCase to snake_case", () => {
      expect(formatString("helloWorld", StringFormat.SNAKE_CASE)).toBe("hello_world");
      expect(formatString("myVariableName", StringFormat.SNAKE_CASE)).toBe("my_variable_name");
    });

    it("should convert PascalCase to snake_case", () => {
      expect(formatString("UserProfile", StringFormat.SNAKE_CASE)).toBe("user_profile");
      expect(formatString("HelloWorld", StringFormat.SNAKE_CASE)).toBe("hello_world");
    });

    it("should convert spaces to underscores", () => {
      expect(formatString("hello world", StringFormat.SNAKE_CASE)).toBe("hello_world");
      expect(formatString("Hello World", StringFormat.SNAKE_CASE)).toBe("hello_world");
    });

    it("should handle multiple spaces", () => {
      expect(formatString("hello   world", StringFormat.SNAKE_CASE)).toBe("hello_world");
      expect(formatString("hello  beautiful  world", StringFormat.SNAKE_CASE)).toBe("hello_beautiful_world");
    });

    it("should handle mixed cases and spaces", () => {
      expect(formatString("My Cool Variable", StringFormat.SNAKE_CASE)).toBe("my_cool_variable");
      expect(formatString("MyCoolVariable Name", StringFormat.SNAKE_CASE)).toBe("my_cool_variable_name");
    });

    it("should handle strings that are already snake_case", () => {
      expect(formatString("hello_world", StringFormat.SNAKE_CASE)).toBe("hello_world");
      expect(formatString("my_variable_name", StringFormat.SNAKE_CASE)).toBe("my_variable_name");
    });
  });
});
