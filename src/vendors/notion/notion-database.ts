import {
  PageObjectResponse,
  PartialPageObjectResponse,
  PartialDatabaseObjectResponse,
  DatabaseObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import appConfig from "../../app/config";
import { Database } from "../../shared/database";
import { getNotionEntityMetadata } from "./notion-entity.decorator";
import { NotionEntityMapper } from "./notion-entity.mapper";
import { NotionClient } from "./notion.client";

type DatabaseResponse = (
  | PageObjectResponse
  | PartialPageObjectResponse
  | PartialDatabaseObjectResponse
  | DatabaseObjectResponse
)[];
type PageResponse = PageObjectResponse | PartialPageObjectResponse;

export class NotionDatabase {
  constructor(private readonly client: NotionClient = new NotionClient({ api_key: appConfig().notion.api_key })) {}

  async findAll(databaseId: string, data: any): Promise<DatabaseResponse> {
    const response = await this.client.databases.query({
      database_id: databaseId,
    });

    return response.results;
  }

  async findById(id: string): Promise<PageResponse | null> {
    const response = await this.client.pages.retrieve({
      page_id: id,
    });

    if (!response.id) {
      return null;
    }

    return response;
  }

  async findBy(databaseId: string, query: any): Promise<DatabaseResponse> {
    const response = await this.client.databases.query({
      database_id: databaseId,
      filter: query,
    });

    return response.results;
  }

  async update(data: any): Promise<PageResponse> {
    return await this.client.pages.update(data);
  }

  async create(data: any): Promise<PageResponse> {
    return await this.client.pages.create(data);
  }
}
