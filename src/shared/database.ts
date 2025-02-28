export interface Database<Entity> {
  findAll(): Promise<Entity[]>;
  findBy(query: any): Promise<Entity[]>;
  findById(id: string): Promise<Entity | null>;
  findByIdOrFail(id: string): Promise<Entity>;
  findOne(query: any): Promise<Entity | null>;
  findOneOrFail(query: any): Promise<Entity>;
  update(id: string, entity: Partial<Entity>): Promise<Entity>;
  create(entity: Omit<Entity, "id">): Promise<Entity>;
}
