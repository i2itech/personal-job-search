import { Database } from "../../shared/database";
import { NotionDatabase } from "./notion-database";
import { getNotionEntityMetadata } from "./notion-entity.decorator";
import { NotionEntityMapper } from "./notion-entity.mapper";

export class NotionDatabaseAdapter<TEntity> implements Database<TEntity> {
  private readonly db: NotionDatabase;
  private readonly EntityClass: new () => TEntity;
  private readonly mapper: NotionEntityMapper;
  private readonly metadata: any;

  constructor(
    EntityClass: new () => TEntity,
    mapper: NotionEntityMapper = new NotionEntityMapper(),
    db: NotionDatabase = new NotionDatabase()
  ) {
    this.EntityClass = EntityClass;
    this.mapper = mapper;
    this.db = db;
    this.metadata = getNotionEntityMetadata(this.EntityClass);
  }

  async findAll(): Promise<TEntity[]> {
    const results = await this.db.findAll(this.metadata.database_id, this.EntityClass);
    return results.map((row) => this.mapper.toEntity(row, this.EntityClass));
  }

  async findBy(query: any): Promise<TEntity[]> {
    const results = await this.db.findBy(this.metadata.database_id, query);
    return results.map((row) => this.mapper.toEntity(row, this.EntityClass));
  }

  async findById(id: string): Promise<TEntity | null> {
    const result = await this.db.findById(id);
    if (!result) {
      return null;
    }

    return this.mapper.toEntity(result, this.EntityClass);
  }

  async findByIdOrFail(id: string): Promise<TEntity> {
    const result = await this.findById(id);
    if (!result) {
      throw new Error("No entity found");
    }

    return result;
  }

  async findOne(query: any): Promise<TEntity | null> {
    const results = await this.findBy(query);

    if (results.length === 0) {
      return null;
    }

    return results[0];
  }

  async findOneOrFail(query: any): Promise<TEntity> {
    const result = await this.findOne(query);
    if (!result) {
      throw new Error("No entity found");
    }
    return result;
  }

  async update(id: string, entity: Partial<TEntity>): Promise<TEntity> {
    const notionData = this.mapper.toUpdatePageParameters(id, entity);
    console.log("notionData", notionData);
    const response = await this.db.update(notionData);
    return this.mapper.toEntity(response, this.EntityClass);
  }

  async create(entity: Omit<TEntity, "id">): Promise<TEntity> {
    const notionData = this.mapper.toCreatePageParameters(this.metadata.database_id, entity);
    const response = await this.db.create(notionData);
    return this.mapper.toEntity(response, this.EntityClass);
  }
}
