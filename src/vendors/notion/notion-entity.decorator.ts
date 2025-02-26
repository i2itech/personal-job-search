import "reflect-metadata";

export interface NotionEntityOptions {
  database_id: string;
}

type NotionPropertyType =
  | "id"
  | "title"
  | "rich_text"
  | "select"
  | "multi_select"
  | "url"
  | "number"
  | "date"
  | "checkbox"
  | "relation"
  | "rollup"
  | "files"
  | "status"
  | "formula";

interface NotionEntityPropertyOptions {
  type: NotionPropertyType;
  notionKey?: string;
}

export const NOTION_ENTITY_KEY = "notion:entity";

export function NotionEntity(options: NotionEntityOptions) {
  return function (target: Function) {
    Reflect.defineMetadata(NOTION_ENTITY_KEY, options, target);
  };
}

const notionMetadataKey = Symbol("notionProperty");

export function NotionEntityProperty(options: NotionEntityPropertyOptions) {
  return function (target: any, propertyKey: string) {
    const properties = Reflect.getMetadata(notionMetadataKey, target) || {};
    properties[propertyKey] = {
      ...options,
      notionKey: options.notionKey || propertyKey,
    };
    Reflect.defineMetadata(notionMetadataKey, properties, target);
  };
}

export function getNotionEntityMetadata(target: Function): NotionEntityOptions {
  const metadata = Reflect.getMetadata(NOTION_ENTITY_KEY, target);
  if (!metadata) {
    throw new Error(`No Notion entity metadata found for ${target.name}`);
  }
  return metadata;
}

export function getNotionProperties(target: any): Record<string, NotionEntityPropertyOptions> {
  return Reflect.getMetadata(notionMetadataKey, target) || {};
}
