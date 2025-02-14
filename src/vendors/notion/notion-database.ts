import { Database } from "../../shared/database";
import { NotionClient } from "./notion.client";
import { getMetadata, NOTION_ENTITY_KEY, NotionEntityOptions } from "./decorators/notion-entity.decorator";
import "reflect-metadata";
import { DatabaseObjectResponse, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

export class NotionDatabase implements Database {
  constructor(private readonly client: NotionClient) {}

  async findAll<Entity>(): Promise<Entity[]> {
    const metadata = getMetadata<Entity>();
    if (!metadata?.database_id) {
      throw new Error("No database_id found. Did you forget to add @NotionEntity decorator?");
    }

    const database = await this.getDatabase(metadata.database_id);
    // TODO: Implement the actual query to get all records
    return database.
  }

  private getEntityType<Entity>(): Function {
    // This is a hack to get the entity type at runtime
    return new Error().stack?.split("\n")[2].match(/\<([^>]+)\>/)?.[1] as any;
  }

  private getDatabaseId<Entity>(): string {

    const entityClass = this.getEntityType<Entity>();
    const metadata = Reflect.getMetadata(NOTION_ENTITY_KEY, entityClass) as NotionEntityOptions;
    return metadata?.database_id;
  }

  private async queryDatabase(databaseId: string): Promise<QueryDatabaseResponse> {
    const dbQueryResult = await this.client.databases.query({
      database_id: databaseId,
    });

    return dbQueryResult;
  }
}
