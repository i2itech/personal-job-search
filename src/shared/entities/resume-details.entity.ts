import { index, modelOptions, prop } from "@typegoose/typegoose";
import { ResumeDetails, ResumeSkillSet, ResumeWorkExperience } from "../types";

@modelOptions({ schemaOptions: { collection: "resume" } })
@index({ job_application_id: 1 }, { unique: true })
export class ResumeDetailsEntity implements ResumeDetails {
  constructor(partial: Partial<ResumeDetailsEntity> = {}) {
    Object.assign(this, partial);
  }

  @prop({ required: true, unique: true })
  job_application_id: string;

  @prop({ required: true })
  summary: string;

  @prop({ type: () => [Object], default: [] })
  skill_sets: ResumeSkillSet[];

  @prop({ type: () => [Object], default: [] })
  work_experience: ResumeWorkExperience[];
}
