import { Database } from "../database";
export class BaseRepository<Entity> {
  constructor(protected readonly db: Database<Entity>) {}

  async findAll(): Promise<Entity[]> {
    return this.db.findAll();
  }

  async findByIdOrFail(id: string): Promise<Entity> {
    return this.db.findByIdOrFail(id);
  }

  async findOne(query: any): Promise<Entity | null> {
    return this.db.findOne(query);
  }

  async findOneOrFail(query: any): Promise<Entity> {
    return this.db.findOneOrFail(query);
  }

  async findById(id: string): Promise<Entity | null> {
    return this.db.findById(id);
  }

  async findBy(query: any): Promise<Entity[]> {
    return this.db.findBy(query);
  }

  async create(entity: Omit<Entity, "id">): Promise<Entity> {
    return this.db.create(entity);
  }

  async update(entity: Partial<Entity> & { id: string }): Promise<Entity> {
    console.log("Updating entity", entity);
    return this.db.update(entity.id, entity);
  }
}
