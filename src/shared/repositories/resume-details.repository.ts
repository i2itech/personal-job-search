import { getModelForClass } from "@typegoose/typegoose";
import { MongooseDatabase } from "../../vendors/mongodb/mongoose-database";
import { ResumeDetailsEntity } from "../entities/resume-details.entity";

export class ResumeDetailsRepository {
  constructor(
    private readonly db: MongooseDatabase<ResumeDetailsEntity> = new MongooseDatabase(
      getModelForClass(ResumeDetailsEntity)
    )
  ) {}

  async findOneByJobApplication(job_application_id: string) {
    return this.db.findOne({ job_application_id });
  }

  async create(entity: ResumeDetailsEntity) {
    return this.db.create(entity);
  }

  async update(id: string, entity: Partial<ResumeDetailsEntity>) {
    return this.db.update(id, entity);
  }

  async upsert(entity: Partial<ResumeDetailsEntity> & { job_application_id: string }) {
    console.log("Upserting resume details", entity);
    const existing = await this.findOneByJobApplication(entity.job_application_id);
    if (existing) {
      console.log("Existing resume details", existing);
      return this.update(existing.id, entity);
    }
    console.log("Creating new resume details", entity);
    return this.create(new ResumeDetailsEntity(entity));
  }
}
