import { NotionEntityMapper } from "./notion-entity.mapper";
import { NotionEntityProperty } from "./notion-entity.decorator";

describe("NotionEntityMapper", () => {
  let mapper: NotionEntityMapper;

  // Test entity class with all property types
  class TestEntity {
    @NotionEntityProperty({ type: "id" })
    id: string;

    @NotionEntityProperty({ type: "title" })
    title: string;

    @NotionEntityProperty({ type: "rich_text" })
    description: string;

    @NotionEntityProperty({ type: "select" })
    status: string;

    @NotionEntityProperty({ type: "multi_select" })
    tags: string[];

    @NotionEntityProperty({ type: "url" })
    website: string;

    @NotionEntityProperty({ type: "number" })
    count: number;

    @NotionEntityProperty({ type: "date" })
    startDate: Date;

    @NotionEntityProperty({ type: "checkbox" })
    isActive: boolean;

    @NotionEntityProperty({ type: "relation" })
    relatedId: string;

    @NotionEntityProperty({ type: "files" })
    attachment: { url: string; name: string };

    @NotionEntityProperty({ type: "status" })
    progress: string;

    @NotionEntityProperty({ type: "formula" })
    calculated: number;

    @NotionEntityProperty({ type: "rollup" })
    rollupArray: string;

    @NotionEntityProperty({ type: "rollup" })
    rollupNumber: number;
  }

  const MOCK_DATABASE_ID = "test-db";
  const MOCK_PAGE_ID = "page-123";
  const MOCK_DATE = new Date("2024-01-01");
  const MOCK_DATE_ISO = "2024-01-01T00:00:00.000Z";
  const MOCK_ROLLUP_ARRAY = ["Rolled up text", "Rolled up text 2"];

  const MOCK_ENTITY_VALUES = {
    title: "Test Title",
    description: "Test Description",
    status: "Active",
    tags: ["tag1", "tag2"],
    website: "https://example.com",
    count: 42,
    startDate: MOCK_DATE,
    isActive: true,
    relatedId: "rel-123",
    attachment: { url: "https://file.com", name: "test.pdf" },
    progress: "In Progress",
    calculated: 100,
    rollupArray: MOCK_ROLLUP_ARRAY.join(""),
    rollupNumber: 42.5,
  };

  const MOCK_NOTION_PAGE = {
    id: MOCK_PAGE_ID,
    properties: {
      title: { title: [{ plain_text: MOCK_ENTITY_VALUES.title }] },
      description: { rich_text: [{ plain_text: MOCK_ENTITY_VALUES.description }] },
      status: { select: { name: MOCK_ENTITY_VALUES.status } },
      tags: { multi_select: MOCK_ENTITY_VALUES.tags.map((name) => ({ name })) },
      website: { url: MOCK_ENTITY_VALUES.website },
      count: { number: MOCK_ENTITY_VALUES.count },
      startDate: { date: { start: MOCK_DATE_ISO } },
      isActive: { checkbox: MOCK_ENTITY_VALUES.isActive },
      relatedId: { relation: [{ id: MOCK_ENTITY_VALUES.relatedId }] },
      attachment: {
        files: [
          {
            external: { url: MOCK_ENTITY_VALUES.attachment.url },
            name: MOCK_ENTITY_VALUES.attachment.name,
          },
        ],
      },
      progress: { status: { name: MOCK_ENTITY_VALUES.progress } },
      calculated: { formula: { number: MOCK_ENTITY_VALUES.calculated } },
      rollupArray: {
        rollup: {
          type: "array",
          array: MOCK_ROLLUP_ARRAY.map((text) => ({ title: [{ plain_text: text }] })),
        },
      },
      rollupNumber: {
        rollup: {
          type: "number",
          number: MOCK_ENTITY_VALUES.rollupNumber,
        },
      },
    },
  };

  const MOCK_NOTION_PROPERTIES = {
    title: { title: [{ type: "text", text: { content: MOCK_ENTITY_VALUES.title } }] },
    description: { rich_text: [{ text: { content: MOCK_ENTITY_VALUES.description } }] },
    status: { select: { name: MOCK_ENTITY_VALUES.status } },
    tags: { multi_select: MOCK_ENTITY_VALUES.tags.map((name) => ({ name })) },
    website: { url: MOCK_ENTITY_VALUES.website },
    count: { number: MOCK_ENTITY_VALUES.count },
    startDate: { date: { start: MOCK_DATE_ISO } },
    isActive: { checkbox: MOCK_ENTITY_VALUES.isActive },
    relatedId: { relation: [{ id: MOCK_ENTITY_VALUES.relatedId }] },
    attachment: {
      files: [
        {
          external: { url: MOCK_ENTITY_VALUES.attachment.url },
          name: MOCK_ENTITY_VALUES.attachment.name,
        },
      ],
    },
    progress: { status: { name: MOCK_ENTITY_VALUES.progress } },
  };

  beforeEach(() => {
    mapper = new NotionEntityMapper();
  });

  describe("toCreatePageParameters", () => {
    it("should convert entity to Notion create parameters", () => {
      const entity = new TestEntity();
      Object.assign(entity, MOCK_ENTITY_VALUES);

      const result = mapper.toCreatePageParameters(MOCK_DATABASE_ID, entity);

      expect(result).toEqual({
        parent: { database_id: MOCK_DATABASE_ID },
        properties: MOCK_NOTION_PROPERTIES,
      });
    });
  });

  describe("toUpdatePageParameters", () => {
    it("should convert entity to Notion update parameters", () => {
      const entity = new TestEntity();
      entity.id = MOCK_PAGE_ID;
      Object.assign(entity, MOCK_ENTITY_VALUES);

      const result = mapper.toUpdatePageParameters(MOCK_PAGE_ID, entity);

      expect(result).toEqual({
        page_id: MOCK_PAGE_ID,
        properties: MOCK_NOTION_PROPERTIES,
      });
    });
  });

  describe("toEntity", () => {
    it("should convert Notion page to entity", () => {
      const result = mapper.toEntity(MOCK_NOTION_PAGE, TestEntity);

      expect(result).toBeInstanceOf(TestEntity);
      expect(result.id).toBe(MOCK_PAGE_ID);
      expect(result.title).toBe(MOCK_ENTITY_VALUES.title);
      expect(result.description).toBe(MOCK_ENTITY_VALUES.description);
      expect(result.status).toBe(MOCK_ENTITY_VALUES.status);
      expect(result.tags).toEqual(MOCK_ENTITY_VALUES.tags);
      expect(result.website).toBe(MOCK_ENTITY_VALUES.website);
      expect(result.count).toBe(MOCK_ENTITY_VALUES.count);
      expect(result.startDate).toEqual(MOCK_DATE);
      expect(result.isActive).toBe(MOCK_ENTITY_VALUES.isActive);
      expect(result.relatedId).toBe(MOCK_ENTITY_VALUES.relatedId);
      expect(result.attachment).toEqual(MOCK_ENTITY_VALUES.attachment);
      expect(result.progress).toBe(MOCK_ENTITY_VALUES.progress);
      expect(result.calculated).toBe(MOCK_ENTITY_VALUES.calculated);
      expect(result.rollupArray).toBe(MOCK_ENTITY_VALUES.rollupArray);
      expect(result.rollupNumber).toBe(MOCK_ENTITY_VALUES.rollupNumber);
    });

    it("should handle missing or null properties", () => {
      const notionPage = {
        id: MOCK_PAGE_ID,
        properties: {
          title: { title: [] },
          status: { select: null },
        },
      };

      const result = mapper.toEntity(notionPage, TestEntity);

      expect(result.id).toBe(MOCK_PAGE_ID);
      expect(result.title).toBeUndefined();
      expect(result.status).toBeUndefined();
    });
  });
});
