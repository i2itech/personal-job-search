import { modelOptions, prop } from "@typegoose/typegoose";
import {
  RelevantWorkExperience,
  RemainingWorkExperience,
  ResumeDetails,
  ResumeSkillSet,
  ResumeSkillSetType,
  ResumeWorkExperience,
} from "../types";
import { BaseEntity } from "./base.entity";

export class ResumeSkillSetEntity implements ResumeSkillSet {
  @prop({ type: String, required: true })
  type: ResumeSkillSetType;

  @prop({ type: [String], required: true })
  skills: string[];

  @prop({ type: Number, required: true })
  order: number;
}

export class RelevantWorkExperienceEntity implements RelevantWorkExperience {
  @prop({ type: String, required: true })
  company: string;

  @prop({ type: String, required: true })
  role: string;

  @prop({ type: String, required: true })
  location: string;

  @prop({ type: String, required: true })
  start_date: string;

  @prop({ type: String, required: true })
  end_date: string;

  @prop({ type: [String], required: true })
  key_technologies: string[];

  @prop({ type: [String], required: true })
  experiences: string[];

  @prop({ type: Number, required: true })
  order: number;
}

export class RemainingWorkExperienceEntity implements RemainingWorkExperience {
  @prop({ type: [String], required: true })
  companies: string[];

  @prop({ type: Number, required: true })
  start_year: number;

  @prop({ type: Number, required: true })
  end_year: number;

  @prop({ type: [String], required: true })
  key_technologies: string[];

  @prop({ type: [String], required: true })
  experiences: string[];
}

export class ResumeWorkExperienceEntity implements ResumeWorkExperience {
  @prop({ type: () => [RelevantWorkExperienceEntity], required: true })
  relevant: RelevantWorkExperienceEntity[];

  @prop({ type: RemainingWorkExperienceEntity, required: false })
  remaining?: RemainingWorkExperienceEntity;
}

@modelOptions({ schemaOptions: { collection: "resume" } })
export class ResumeDetailsEntity extends BaseEntity implements ResumeDetails {
  constructor(partial: Partial<ResumeDetailsEntity> = {}) {
    super();
    Object.assign(this, partial);
  }

  @prop({ type: String, required: true, index: true, unique: true })
  job_application_id: string;

  @prop({ type: String, required: false })
  summary?: string;

  @prop({ type: () => [ResumeSkillSetEntity], default: [] })
  skill_sets: ResumeSkillSetEntity[];

  @prop({ type: ResumeWorkExperienceEntity, required: false })
  work_experience?: ResumeWorkExperienceEntity;
}
