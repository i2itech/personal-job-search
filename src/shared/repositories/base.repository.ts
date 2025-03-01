import { Database } from "../database";
import { getLogger } from "../logger.service";

const Logger = getLogger("base:repository");

export class BaseRepository<Entity> {
  constructor(protected readonly db: Database<Entity>) {}

  async findAll(): Promise<Entity[]> {
    Logger.debug("Finding all entities");
    const entities = await this.db.findAll();
    Logger.debug(`Found ${entities.length} entities`);
    return entities;
  }

  async findByIdOrFail(id: string): Promise<Entity> {
    Logger.debug(`Finding entity by id: ${id}`);
    const entity = await this.db.findByIdOrFail(id);
    Logger.debug(`Found entity by id: ${id}`);
    return entity;
  }

  async findOne(query: any): Promise<Entity | null> {
    Logger.debug(`Finding one entity by query: ${JSON.stringify(query)}`);
    const entity = await this.db.findOne(query);
    Logger.debug(`Found one entity by query: ${JSON.stringify(query)}`);
    return entity;
  }

  async findOneOrFail(query: any): Promise<Entity> {
    Logger.debug(`Finding one entity by query: ${JSON.stringify(query)}`);
    const entity = await this.db.findOneOrFail(query);
    Logger.debug(`Found one entity by query: ${JSON.stringify(query)}`);
    return entity;
  }

  async findById(id: string): Promise<Entity | null> {
    Logger.debug(`Finding entity by id: ${id}`);
    const entity = await this.db.findById(id);
    Logger.debug(`Found entity by id: ${id}`);
    return entity;
  }

  async findBy(query: any): Promise<Entity[]> {
    Logger.debug(`Finding entities by query: ${JSON.stringify(query)}`);
    const entities = await this.db.findBy(query);
    Logger.debug(`Found ${entities.length} entities by query: ${JSON.stringify(query)}`);
    return entities;
  }

  async create(entity: Omit<Entity, "id">): Promise<Entity> {
    Logger.debug(`Creating entity: ${JSON.stringify(entity)}`);
    const createdEntity = await this.db.create(entity);
    Logger.debug(`Created entity: ${JSON.stringify(createdEntity)}`);
    return createdEntity;
  }

  async update(entity: Partial<Entity> & { id: string }): Promise<Entity> {
    Logger.debug(`Updating entity: ${JSON.stringify(entity)}`);
    const updatedEntity = await this.db.update(entity.id, entity);
    Logger.debug(`Updated entity: ${JSON.stringify(updatedEntity)}`);
    return updatedEntity;
  }
}
