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

const NOTION_ENTITY_KEY = Symbol("notion:entity");
const NOTION_METADATA_KEY = Symbol("notion:property");

export function NotionEntity(options: NotionEntityOptions): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata(NOTION_ENTITY_KEY, options, target);
  };
}

export function getNotionEntityMetadata(target: Function): NotionEntityOptions {
  const metadata = Reflect.getMetadata(NOTION_ENTITY_KEY, target);
  if (!metadata) {
    throw new Error(`No Notion entity metadata found for ${target.name}`);
  }
  return metadata;
}

export function NotionEntityProperty(options: NotionEntityPropertyOptions): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const properties = Reflect.getMetadata(NOTION_METADATA_KEY, target) || {};
    properties[propertyKey] = {
      ...options,
      notionKey: options.notionKey || propertyKey,
    };
    Reflect.defineMetadata(NOTION_METADATA_KEY, properties, target);
  };
}

export function getNotionProperties(target: any): Record<string, NotionEntityPropertyOptions> {
  return Reflect.getMetadata(NOTION_METADATA_KEY, target) || {};
}
