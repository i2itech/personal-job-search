import { ReturnModelType } from "@typegoose/typegoose";
import { ClassConstructor } from "class-transformer";
import mongoose from "mongoose";

export class MongooseDatabase<TEntity> {
  constructor(private readonly model: ReturnModelType<ClassConstructor<TEntity>>) {}

  async findAll(): Promise<TEntity[]> {
    return this.model.find();
  }

  async findById(id: string): Promise<TEntity | null> {
    return this.model.findById(id);
  }

  async findOne(query: mongoose.FilterQuery<TEntity>): Promise<TEntity | null> {
    const document = await this.model.findOne(query);
    return document ? (document.toObject() as TEntity) : null;
  }

  async create(entity: TEntity): Promise<TEntity> {
    const document = await this.model.create(entity);
    return document.toObject() as TEntity;
  }
  async update(id: string, entity: Partial<TEntity>): Promise<TEntity | null> {
    const updatedEntity = await this.model.findByIdAndUpdate(id, entity, { new: true });
    return updatedEntity ? (updatedEntity.toObject() as TEntity) : null;
  }
}
