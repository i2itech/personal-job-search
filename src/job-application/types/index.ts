import { z } from "zod";
import { OpportunityType } from "../../shared/entities/opportunity.entity";

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

export const ImportJobApplicationRequestSchema = z.object({
  company_name: z.string().describe("The name of the company"),
  company_website_url: z.string().optional().describe("The website URL of the company"),
  company_linkedin_url: z.string().optional().describe("The LinkedIn URL of the company"),
  job_title: z.string().describe("The title of the job"),
  job_description: z.string().describe("The description of the job"),
  job_analysis: z.string().describe("The analysis of the job"),
  job_posting_url: z.string().describe("The URL of the job posting"),
  pay_type: z
    .enum(["Hourly", "Salary"])
    .describe("The type of pay for the job hourly for contract or salary for full-time"),
});

export type ImportJobApplicationRequest = z.infer<typeof ImportJobApplicationRequestSchema>;

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

export const ResumeSkillSetSchema = z.object({
  type: z.nativeEnum(ResumeSkillSetType),
  skills: z.array(z.string()),
  order: z.number(),
});

export type ResumeSkillSet = z.infer<typeof ResumeSkillSetSchema>;

export const ResumeWorkExperienceSchema = z.object({
  company: z.string().describe("The company name"),
  role: z.string().describe("The role of the job"),
  location: z.string().describe("The location of the job"),
  start_date: z.string().describe("The start month and year of the job (ex December 2024)"),
  end_date: z.string().describe("The end month and year of the job (ex December 2024)"),
  key_technologies: z.array(z.string()).describe("The key technologies used in the job"),
  experiences: z.array(z.string()).describe("A list of experiences in the job"),
  order: z.number().describe("The order of the job in the list"),
});
export type ResumeWorkExperience = z.infer<typeof ResumeWorkExperienceSchema>;

export const GenerateResumeRequestSchema = z.object({
  job_application_id: z.string().describe("The ID of the job application"),
  summary: z.string().describe("A professional summary of the applicant"),
  skill_sets: z.array(ResumeSkillSetSchema).describe("A list of skill sets"),
  work_experience: z.array(ResumeWorkExperienceSchema).describe("A list of work experiences"),
});

export type GenerateResumeRequest = z.infer<typeof GenerateResumeRequestSchema>;

export const GenerateCoverLetterRequestSchema = z.object({
  job_application_id: z.string().describe("The ID of the job application"),
  cover_letter: z.string().describe("The cover letter of the applicant"),
});

export type GenerateCoverLetterRequest = z.infer<typeof GenerateCoverLetterRequestSchema>;

export const ImportJobApplicationResponseSchema = z.object({
  message: z.string(),
  job_application: z.object({
    id: z.string(),
    title: z.string(),
    type: z.nativeEnum(OpportunityType),
    company_id: z.string().optional(),
    company_name: z.string().optional(),
    posting_url: z.string().optional(),
    application_status: z.string().optional(),
    lead_status: z.string().optional(),
    tags: z.array(z.string()).optional(),
    job_description: z.string().optional(),
    job_analysis: z.string().optional(),
    resume: z
      .object({
        id: z.string(),
        name: z.string(),
        url: z.string(),
      })
      .optional(),
    cover_letter: z
      .object({
        id: z.string(),
        name: z.string(),
        url: z.string(),
      })
      .optional(),
    min_estimated_value: z.number().optional(),
    max_estimated_value: z.number().optional(),
    estimated_value: z.number().optional(),
    date_applied: z.string().optional(),
    pay_type: z.string().optional(),
    cycle: z.string().optional(),
    results: z.string().optional(),
    is_draft: z.boolean().optional(),
  }),
});
