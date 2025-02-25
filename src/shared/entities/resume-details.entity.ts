import { modelOptions, prop } from "@typegoose/typegoose";
import { ResumeDetails, ResumeSkillSet, ResumeWorkExperience } from "../types";
import { BaseEntity } from "./base.entity";

@modelOptions({ schemaOptions: { collection: "resume" } })
export class ResumeDetailsEntity extends BaseEntity implements ResumeDetails {
  constructor(partial: Partial<ResumeDetailsEntity> = {}) {
    super();
    Object.assign(this, partial);
  }

  @prop({ required: true, index: true, unique: true })
  job_application_id: string;

  @prop({ required: false })
  summary?: string;

  @prop({ type: () => [Object], default: [] })
  skill_sets: ResumeSkillSet[];

  @prop({ type: () => [Object], default: [] })
  work_experience: ResumeWorkExperience[];
}
