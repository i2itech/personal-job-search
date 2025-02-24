import { MongooseDatabase } from "../../vendors/mongodb/mongoose-database";
import { ResumeDetailsEntity } from "../entities/resume-details.entity";

export class ResumeDetailsRepository {
  constructor(private readonly db: MongooseDatabase<ResumeDetailsEntity> = new MongooseDatabase(ResumeDetailsEntity)) {}

  async findOneByJobApplication(job_application_id: string) {
    return this.db.findById(job_application_id);
  }

  async create(entity: ResumeDetailsEntity) {
    return this.db.create(entity);
  }

  async update(id: string, entity: Partial<ResumeDetailsEntity>) {
    return this.db.update(id, entity);
  }

  async upsert(entity: Partial<ResumeDetailsEntity> & { job_application_id: string }) {
    const existing = await this.findOneByJobApplication(entity.job_application_id);
    if (existing) {
      return this.update(existing.job_application_id, entity);
    }
    return this.create(new ResumeDetailsEntity(entity));
  }
}
