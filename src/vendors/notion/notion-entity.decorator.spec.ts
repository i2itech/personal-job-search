import { NotionEntity, getNotionEntityMetadata } from "./notion-entity.decorator";

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
});
