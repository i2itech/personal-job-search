import { NotionDatabase } from "./notion-database";
import { NotionEntityMapper } from "./notion-entity.mapper";
import { NotionClient } from "./notion.client";
import { Database } from "../../shared/database";

export class NotionDatabaseWrapper<TEntity> implements Database<TEntity> {
  private readonly db: NotionDatabase;
  private readonly EntityClass: new () => TEntity;

  constructor(
    EntityClass: new () => TEntity,
    client: NotionClient = new NotionClient(),
    mapper: NotionEntityMapper = new NotionEntityMapper()
  ) {
    this.EntityClass = EntityClass;
    this.db = new NotionDatabase(client, mapper);
  }

  async findAll(): Promise<TEntity[]> {
    return this.db.findAll(this.EntityClass);
  }

  async findById(id: string): Promise<TEntity> {
    return this.db.findById(id, this.EntityClass);
  }

  async findBy(query: any): Promise<TEntity[]> {
    return this.db.findBy(query, this.EntityClass);
  }

  async findOne(query: any): Promise<TEntity> {
    const results = await this.findBy(query);
    return results[0];
  }

  async update(entity: TEntity): Promise<TEntity> {
    return this.db.update(entity, this.EntityClass);
  }

  async create(entity: TEntity): Promise<TEntity> {
    return this.db.create(entity, this.EntityClass);
  }
}
