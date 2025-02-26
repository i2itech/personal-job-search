import { CreatePageParameters, UpdatePageParameters } from "@notionhq/client/build/src/api-endpoints";
import { ExternalFile } from "../../shared/types";
import { getNotionProperties } from "./notion-entity.decorator";

type CreatePageProperties = CreatePageParameters["properties"];
type UpdatePageProperties = UpdatePageParameters["properties"];
type NotionProperties = CreatePageProperties; // Same as UpdatePageProperties
type NotionPropertyValue = CreatePageProperties[keyof CreatePageProperties];

export class NotionEntityMapper {
  public toCreatePageParameters<T>(databaseId: string, entity: T): CreatePageParameters {
    return {
      parent: { database_id: databaseId },
      properties: this.toNotionProperties(entity) as CreatePageProperties,
    };
  }

  public toUpdatePageParameters<T>(id: string, entity: Partial<T>): UpdatePageParameters {
    return {
      page_id: id,
      properties: this.toNotionProperties(entity) as UpdatePageProperties,
    };
  }

  public toEntity<T>(row: any, EntityClass: new () => T): T {
    const { id, properties } = row;
    const entity = new EntityClass();
    const notionProperties = getNotionProperties(EntityClass.prototype);

    (entity as any).id = id;

    for (const [propertyKey, options] of Object.entries(notionProperties)) {
      if (!options.notionKey) continue;
      const notionValue = properties[options.notionKey];
      if (!notionValue) continue;

      (entity as any)[propertyKey] = this.extractNotionValue(notionValue, options.type);
    }

    return entity;
  }

  protected extractNotionValue(value: any, type: string): any {
    switch (type) {
      case "title":
        return value.title[0]?.plain_text;

      case "rich_text":
        return value.rich_text.map((text: any) => text.plain_text).join("");

      case "select":
        return value.select?.name;

      case "multi_select":
        return value.multi_select.map((item: any) => item.name);

      case "url":
        return value.url;

      case "number":
        return value.number;

      case "date":
        return value.date?.start ? new Date(value.date.start) : undefined;

      case "checkbox":
        return value.checkbox;

      case "relation":
        return value.relation[0]?.id;

      case "rollup":
        if (value.rollup.type === "array") {
          return value.rollup.array
            .map((item: any) => {
              if (item.title) return item.title[0]?.plain_text;
              return item;
            })
            .join("");
        }
        return value.rollup.number;

      case "files":
        return this.extractExternalFile(value.files);

      case "status":
        return value.status?.name;

      case "formula":
        return value.formula?.number;

      default:
        return value;
    }
  }

  protected extractExternalFile(files?: { external?: { url: string }; name: string }[]): ExternalFile | undefined {
    if (!files || files.length === 0) {
      return undefined;
    }

    const file = files[0];

    if (!file.external) {
      return undefined;
    }

    return { url: file.external.url, name: file.name };
  }

  protected toNotionProperties<T>(entity: T): NotionProperties {
    const notionProperties = getNotionProperties(Object.getPrototypeOf(entity));
    const properties: NotionProperties = {};

    for (const [propertyKey, options] of Object.entries(notionProperties)) {
      const value = (entity as any)[propertyKey];
      if (value === undefined) continue;

      if (!options.notionKey) continue;

      const notionValue = this.createNotionValue(value, options.type);
      if (notionValue !== undefined) {
        properties[options.notionKey] = notionValue;
      }
    }

    return properties;
  }

  protected createNotionValue(value: any, type: string): NotionPropertyValue | undefined {
    switch (type) {
      case "title":
        return {
          title: [{ type: "text", text: { content: value } }],
        };

      case "rich_text":
        return {
          rich_text: value.split("\n").map((line: string, index: number, array: string[]) => ({
            text: { content: index < array.length - 1 ? `${line}\n` : line },
          })),
        };

      case "select":
        return {
          select: { name: value },
        };

      case "multi_select":
        return {
          multi_select: value.map((name: string) => ({ name })),
        };

      case "url":
        return { url: value };

      case "number":
        return { number: value };

      case "date":
        return {
          date: value ? { start: value.toISOString() } : null,
        };

      case "checkbox":
        return { checkbox: value };

      case "relation":
        return {
          relation: value ? [{ id: value }] : [],
        };

      case "status":
        return {
          status: { name: value },
        };
      case "files":
        return {
          files: value ? [{ external: { url: value.url }, name: value.name }] : [],
        };
      case "rollup":
      case "formula":
        return undefined;

      default:
        return value;
    }
  }
}
