import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { ClassConstructor } from "class-transformer";
import { Database } from "../../shared/database";

export class MongoDatabase<TEntity> implements Database<TEntity> {
  private readonly model: ReturnModelType<ClassConstructor<TEntity>>;

  constructor(entityClass: ClassConstructor<TEntity>) {
    this.model = getModelForClass(entityClass);
  }

  async findAll(): Promise<TEntity[]> {
    return await this.model.find();
  }

  async findBy(query: any): Promise<TEntity[]> {
    return await this.model.find(query);
  }

  async findById(id: string): Promise<TEntity | null> {
    return await this.model.findById(id);
  }

  async findByIdOrFail(id: string): Promise<TEntity> {
    const document = await this.model.findById(id);
    if (!document) {
      throw new Error("Entity not found");
    }
    return document.toObject() as TEntity;
  }

  async findOneOrFail(query: any): Promise<TEntity> {
    const document = await this.model.findOne(query);
    if (!document) {
      throw new Error("Entity not found");
    }
    return document.toObject() as TEntity;
  }

  async findOne(query: any): Promise<TEntity | null> {
    const document = await this.model.findOne(query);
    return document ? (document.toObject() as TEntity) : null;
  }

  async create(entity: Omit<TEntity, "id">): Promise<TEntity> {
    const document = await this.model.create(entity);
    return document.toObject() as TEntity;
  }

  async update(id: string, entity: Partial<TEntity>): Promise<TEntity> {
    const updatedEntity = await this.model.findByIdAndUpdate(id, entity, { new: true });

    if (!updatedEntity) {
      throw new Error("Entity not found");
    }

    return updatedEntity.toObject() as TEntity;
  }
}
