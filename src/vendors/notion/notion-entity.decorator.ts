import "reflect-metadata";

export interface NotionEntityOptions {
  database_id: string;
}

export const NOTION_ENTITY_KEY = "notion:entity";

export function NotionEntity(options: NotionEntityOptions) {
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
