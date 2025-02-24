import { ResumeDetails, ResumeSkillSet, ResumeWorkExperience } from "../types";

export class ResumeDetailsEntity implements ResumeDetails {
  constructor(partial: Partial<ResumeDetailsEntity> = {}) {
    Object.assign(this, partial);
  }

  job_application_id: string;
  summary: string;
  skill_sets: ResumeSkillSet[] = [];
  work_experience: ResumeWorkExperience[] = [];
}
