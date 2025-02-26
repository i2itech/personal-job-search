export interface Database<Entity> {
  findAll(): Promise<Entity[]>;
  findById(id: string): Promise<Entity>;
  findBy(query: any): Promise<Entity[]>;
  findOne(query: any): Promise<Entity>;
  update(entity: Entity): Promise<Entity>;
  create(entity: Entity): Promise<Entity>;
}
