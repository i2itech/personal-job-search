export interface Database {
  findAll<Entity>(): Promise<Entity[]>;
  findById<Entity>(id: string): Promise<Entity>;
  findBy<Entity>(query: any): Promise<Entity>;
  update<Entity>(entity: Entity): Promise<Entity>;
  create<Entity>(entity: Entity): Promise<Entity>;
}
