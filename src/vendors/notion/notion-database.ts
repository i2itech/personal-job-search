import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { Database } from "../../shared/database";
import { NotionClient } from "./notion.client";
import config from "../../app/config";

export class NotionDatabase implements Database {
  constructor(
    private readonly databaseId: string,
    private readonly client: NotionClient = new NotionClient({ api_key: config.notion.api_key })
  ) {}
  findAll<Entity>(): Promise<Entity[]> {
    throw new Error("Method not implemented.");
  }
  findById<Entity>(id: string): Promise<Entity> {
    throw new Error("Method not implemented.");
  }
  findBy<Entity>(query: any): Promise<Entity> {
    throw new Error("Method not implemented.");
  }
  update<Entity>(entity: Entity): Promise<Entity> {
    throw new Error("Method not implemented.");
  }
  create<Entity>(entity: Entity): Promise<Entity> {
    throw new Error("Method not implemented.");
  }

  private async queryDatabase(): Promise<QueryDatabaseResponse> {
    const dbQueryResult = await this.client.databases.query({
      database_id: this.databaseId,
    });

    return dbQueryResult;
  }
}
