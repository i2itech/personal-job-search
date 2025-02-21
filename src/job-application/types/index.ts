export interface JobApplicationConfig {
  current_cycle: string;
  personal_info: JobApplicationPersonalInfo;
  google_drive: {
    cover_letter_folder_id: string;
    resume_folder_id: string;
  };
}

export interface JobApplicationPersonalInfo {
  name: string;
  phone: string;
  email: string;
  linkedin_url: string;
  github_url: string;
  education: JobApplicationEducation;
}

export type JobApplicationEducation = {
  school: string;
  location: string;
  degree: string;
  minor: string;
};

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

// Resume Types
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

export type GenerateResumeRequest = {
  job_application_id: string;
  summary: string;
  skill_sets: ResumeSkillSet[];
  work_experience: ResumeWorkExperience[];
};
