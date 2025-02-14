import { Database } from "../database";

export class BaseRepository<Entity> {
  constructor(private readonly db: Database) {}

  async findAll(): Promise<Entity[]> {
    return this.db.findAll<Entity>();
  }

  async findById(id: string): Promise<Entity> {
    return this.db.findById<Entity>(id);
  }

  async findBy(query: any): Promise<Entity> {
    return this.db.findBy<Entity>(query);
  }

  async create(entity: Entity): Promise<Entity> {
    return this.db.create<Entity>(entity);
  }

  async update(entity: Entity): Promise<Entity> {
    return this.db.update<Entity>(entity);
  }
}
