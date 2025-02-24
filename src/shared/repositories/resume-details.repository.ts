import { MongooseDatabase } from "../../vendors/mongodb/mongoose-database";
import { ResumeDetailsEntity } from "../entities/resume-details.entity";

export class ResumeDetailsRepository {
  constructor(
    private readonly db: MongooseDatabase<ResumeDetailsEntity> = new MongooseDatabase<ResumeDetailsEntity>(
      ResumeDetailsEntity
    )
  ) {}

  async findOneByJobApplicationId(jobApplicationId: string) {
    return this.db.findOne({ job_application_id: jobApplicationId });
  }

  async create(entity: ResumeDetailsEntity) {
    return this.db.create(entity);
  }

  async update(id: string, entity: Partial<ResumeDetailsEntity>) {
    return this.db.update(id, entity);
  }
}
