import {
  NotionEntity,
  getNotionEntityMetadata,
  NotionEntityProperty,
  getNotionProperties,
} from "./notion-entity.decorator";

describe("NotionEntity Decorator", () => {
  it("should apply metadata to a class and retrieve it correctly", () => {
    // Define test database ID
    const testDatabaseId = "test-database-123";

    // Create a test class with the decorator
    @NotionEntity({
      database_id: testDatabaseId,
    })
    class TestEntity {}

    // Get the metadata
    const metadata = getNotionEntityMetadata(TestEntity);

    // Assert the metadata matches what we set
    expect(metadata).toBeDefined();
    expect(metadata.database_id).toBe(testDatabaseId);
  });

  it("should throw error when getting metadata from non-decorated class", () => {
    // Create a class without the decorator
    class TestEntityWithoutDecorator {}

    // Assert that getting metadata throws an error
    expect(() => {
      getNotionEntityMetadata(TestEntityWithoutDecorator);
    }).toThrow(`No Notion entity metadata found for TestEntityWithoutDecorator`);
  });

  it("should correctly store and retrieve property metadata", () => {
    @NotionEntity({
      database_id: "test-db-123",
    })
    class TestEntityWithProperties {
      @NotionEntityProperty({ type: "title" })
      name: string;

      @NotionEntityProperty({ type: "rich_text", notionKey: "description" })
      desc: string;
    }

    const properties = getNotionProperties(TestEntityWithProperties.prototype);

    expect(properties).toBeDefined();
    expect(properties.name).toEqual({ type: "title", notionKey: "name" });
    expect(properties.desc).toEqual({ type: "rich_text", notionKey: "description" });
  });

  it("should return empty object for properties when no decorators are used", () => {
    class TestEntityNoProperties {}

    const properties = getNotionProperties(TestEntityNoProperties.prototype);

    expect(properties).toEqual({});
  });
});
