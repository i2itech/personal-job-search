export interface JobApplicationConfig {
  current_cycle: string;
}

export type ImportJobApplicationRequest = {
  company_name: string;
  company_website_url?: string;
  company_linkedin_url?: string;
  job_title: string;
  job_description?: string;
  job_analysis?: string;
  job_posting_url?: string;
  pay_type?: string;
};

export type UpdateJobApplication = {
  job_application_id: string;
  resume?: string;
  cover_letter?: string;
  job_analysis?: string;
};

export type UpdateJobResume = {
  job_application_id: string;
  summary: string;
  skill_sets: ResumeSkillSet[];
  work_experience: ResumeWorkExperience[];
};

export enum ResumeSkillSetType {
  PROFESSIONAL_EXPERTISE = "Professional Expertise",
  LANGUAGES = "Languages",
  FRONTEND = "Frontend",
  BACKEND = "Backend",
  AI_LLM = "AI/LLM",
  DATA_STORAGE = "Data Storage",
  DEVOPS_AND_MONITORING = "DevOps and Monitoring",
  AZURE = "Azure",
  AWS = "AWS",
  DEVELOPMENT_TOOLS = "Development Tools",
  OTHERS = "Others",
}

export type ResumeSkillSet = {
  type: ResumeSkillSetType;
  skills: string[];
  order: number;
};

export type ResumeWorkExperience = {
  company: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string;
  key_technologies: string[];
  experiences: string[];
  order: number;
};
