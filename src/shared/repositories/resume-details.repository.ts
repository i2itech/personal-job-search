import { MongoDatabase } from "../../vendors/mongodb/mongo-database";
import { Database } from "../database";
import { ResumeDetailsEntity } from "../entities/resume-details.entity";
import { BaseRepository } from "./base.repository";
export class ResumeDetailsRepository extends BaseRepository<ResumeDetailsEntity> {
  constructor(db: Database<ResumeDetailsEntity> = new MongoDatabase(ResumeDetailsEntity)) {
    super(db);
  }

  async findOneByJobApplication(job_application_id: string) {
    return this.db.findOne({ job_application_id });
  }

  async upsert(entity: Partial<ResumeDetailsEntity> & { job_application_id: string }) {
    const existing = await this.findOneByJobApplication(entity.job_application_id);
    if (existing) {
      return this.update({ id: existing._id, ...entity });
    }
    return this.create(new ResumeDetailsEntity(entity));
  }
}
