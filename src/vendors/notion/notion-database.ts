import config from "../../app/config";
import { Database } from "../../shared/database";
import { NotionClient } from "./notion.client";

export class NotionDatabase implements Database {
  constructor(private readonly client: NotionClient = new NotionClient({ api_key: config.notion.api_key })) {}
  findAll<TEntity>(): Promise<TEntity[]> {
    throw new Error("Method not implemented.");
  }
  findById<TEntity>(id: string): Promise<TEntity> {
    throw new Error("Method not implemented.");
  }
  findBy<TEntity>(query: any): Promise<TEntity> {
    throw new Error("Method not implemented.");
  }
  update<TEntity>(entity: TEntity): Promise<TEntity> {
    throw new Error("Method not implemented.");
  }
  create<TEntity>(entity: TEntity): Promise<TEntity> {
    throw new Error("Method not implemented.");
  }
}
