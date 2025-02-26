import { Database } from "../database";
import { NotionDatabaseWrapper } from "../../vendors/notion/notion-database-wrapper";
export class BaseRepository<Entity> {
  protected readonly db: Database<Entity>;

  constructor(EntityClass: new () => Entity) {
    this.db = new NotionDatabaseWrapper(EntityClass);
  }

  async findAll(): Promise<Entity[]> {
    return this.db.findAll();
  }

  async findById(id: string): Promise<Entity> {
    return this.db.findById(id);
  }

  async findBy(query: any): Promise<Entity[]> {
    return this.db.findBy(query);
  }

  async create(entity: Entity): Promise<Entity> {
    return this.db.create(entity);
  }

  async update(entity: Entity): Promise<Entity> {
    return this.db.update(entity);
  }
}
