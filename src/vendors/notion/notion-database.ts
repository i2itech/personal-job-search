import appConfig from "../../app/config";
import { Database } from "../../shared/database";
import { getNotionEntityMetadata } from "./notion-entity.decorator";
import { NotionEntityMapper } from "./notion-entity.mapper";
import { NotionClient } from "./notion.client";

export class NotionDatabase {
  constructor(
    private readonly client: NotionClient = new NotionClient({ api_key: appConfig().notion.api_key }),
    private readonly mapper: NotionEntityMapper = new NotionEntityMapper()
  ) {}

  async findAll<TEntity>(EntityClass: new () => TEntity): Promise<TEntity[]> {
    const metadata = getNotionEntityMetadata(EntityClass);

    const response = await this.client.databases.query({
      database_id: metadata.database_id,
    });

    return response.results.map((row) => this.mapper.toEntity(row, EntityClass));
  }

  async findById<TEntity>(id: string, EntityClass: new () => TEntity): Promise<TEntity> {
    const response = await this.client.pages.retrieve({
      page_id: id,
    });

    return this.mapper.toEntity(response, EntityClass);
  }

  async findBy<TEntity>(query: any, EntityClass: new () => TEntity): Promise<TEntity[]> {
    const metadata = getNotionEntityMetadata(EntityClass);

    const response = await this.client.databases.query({
      database_id: metadata.database_id,
      filter: query,
    });

    return response.results.map((row) => this.mapper.toEntity(row, EntityClass));
  }

  async update<TEntity>(entity: TEntity, EntityClass: new () => TEntity): Promise<TEntity> {
    const notionData = this.mapper.toUpdatePageParameters(entity);

    const response = await this.client.pages.update(notionData);

    return this.mapper.toEntity(response, EntityClass);
  }

  async create<TEntity>(entity: TEntity, EntityClass: new () => TEntity): Promise<TEntity> {
    const metadata = getNotionEntityMetadata(EntityClass);
    const notionData = this.mapper.toCreatePageParameters(metadata.database_id, entity);

    const response = await this.client.pages.create(notionData);

    return this.mapper.toEntity(response, EntityClass);
  }
}
