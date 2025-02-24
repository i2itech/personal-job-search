import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import { ClassConstructor } from "class-transformer";
import mongoose from "mongoose";
import appConfig from "../../app/config";

// Database connection function
async function connectDB() {
  try {
    await mongoose.connect(appConfig.mongodb.url);
    console.log("MongoDB connected successfully");

    // Handle application shutdown
    process.on("SIGINT", async () => {
      await disconnectDB();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await disconnectDB();
      process.exit(0);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process if connection fails
  }
}

async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected successfully");
  } catch (error) {
    console.error("Error while disconnecting MongoDB:", error);
    process.exit(1);
  }
}

async function useDB<T>(callback: () => Promise<T>) {
  await connectDB();
  try {
    return await callback();
  } finally {
    await disconnectDB();
  }
}
export class MongooseDatabase<TEntity> {
  private readonly model: ReturnModelType<ClassConstructor<TEntity>>;

  constructor(entityClass: ClassConstructor<TEntity>) {
    this.model = getModelForClass(entityClass);
  }

  async findAll(): Promise<TEntity[]> {
    return useDB(() => this.model.find());
  }

  async findById(id: string): Promise<TEntity | null> {
    return useDB(() => this.model.findById(id));
  }

  async findOne(query: mongoose.FilterQuery<TEntity>): Promise<TEntity | null> {
    return useDB(() => this.model.findOne(query));
  }

  async create(entity: TEntity): Promise<TEntity> {
    const document = await useDB(() => this.model.create(entity));
    return document.toObject() as TEntity;
  }
  async update(id: string, entity: Partial<TEntity>): Promise<TEntity | null> {
    const updatedEntity = await useDB(() => this.model.findByIdAndUpdate(id, entity, { new: true }));
    return updatedEntity ? (updatedEntity.toObject() as TEntity) : null;
  }
}
