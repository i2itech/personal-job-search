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

export const CreateJobApplicationRequestSchema = z.object({
  company_name: z.string().describe("The name of the company offering the job"),
  company_website_url: z.string().optional().describe("The official website URL of the company"),
  company_linkedin_url: z.string().optional().describe("The LinkedIn profile URL of the company"),
  job_title: z.string().describe("The title or designation of the job position"),
  job_description: z.string().describe("A detailed description of the job responsibilities and requirements"),
  job_analysis: z
    .string()
    .describe(
      "AI generated analysis of the job opportunity in markdown format, including fit scores or relevance assessments"
    ),
  job_posting_url: z.string().describe("The URL where the job posting is publicly available"),
  pay_type: z
    .enum(["Hourly", "Salary"])
    .describe("Compensation structure - 'Hourly' for contract roles, 'Salary' for full-time positions"),
  min_estimated_value: z.number().optional().describe("The minimum estimated value in USD and either hourly or yearly"),
  max_estimated_value: z.number().optional().describe("The maximum estimated value in USD and either hourly or yearly"),
});

export type CreateJobApplicationRequest = z.infer<typeof CreateJobApplicationRequestSchema>;

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
  type: z.nativeEnum(ResumeSkillSetType).describe("Category classification for the skill set"),
  skills: z.array(z.string()).describe("List of specific skills, technologies, or competencies in this category"),
  order: z.number().describe("Display priority for this skill category (lower numbers appear first)"),
});

export type ResumeSkillSet = z.infer<typeof ResumeSkillSetSchema>;

export const ResumeWorkExperienceSchema = z.object({
  company: z.string().describe("Name of the employer or organization"),
  role: z.string().describe("Job title or position held"),
  location: z.string().describe("Geographic location of the job (city, country)"),
  start_date: z.string().describe("Employment start date in 'Month Year' format (e.g., 'December 2024')"),
  end_date: z.string().describe("Employment end date in 'Month Year' format, or 'Present' if current position"),
  key_technologies: z.array(z.string()).describe("Primary technologies, tools, and frameworks used in the role"),
  experiences: z.array(z.string()).describe("Key achievements, responsibilities, and notable projects"),
  order: z.number().describe("Display order in resume (lower numbers appear first)"),
});
export type ResumeWorkExperience = z.infer<typeof ResumeWorkExperienceSchema>;

export const GenerateResumeRequestSchema = z.object({
  job_application_id: z.string().describe("Unique identifier of the job application to generate resume for"),
  summary: z.string().describe("Professional summary highlighting key qualifications and career objectives"),
  skill_sets: z
    .array(ResumeSkillSetSchema)
    .describe("Categorized list of professional skills and competencies, ordered by relevance"),
  work_experience: z
    .array(ResumeWorkExperienceSchema)
    .describe("Chronological work history showcasing professional experience and achievements"),
});

export type GenerateResumeRequest = z.infer<typeof GenerateResumeRequestSchema>;

export const GenerateCoverLetterRequestSchema = z.object({
  job_application_id: z.string().describe("Unique identifier of the job application to generate cover letter for"),
  cover_letter: z.string().describe("The content of the cover letter, tailored to the job application"),
});

export type GenerateCoverLetterRequest = z.infer<typeof GenerateCoverLetterRequestSchema>;

export const JobApplicationSchema = z.object({
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
      url: z.string().describe("The Google Drive URL of the resume file"),
    })
    .optional(),
  cover_letter: z
    .object({
      id: z.string(),
      name: z.string(),
      url: z.string().describe("The Google Drive URL of the cover letter file"),
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
});

export const GetJobApplicationResponseSchema = JobApplicationSchema;

export const CreateJobApplicationResponseSchema = z.object({
  message: z.string(),
  job_application: JobApplicationSchema,
});

export const GenerateResumeResponseSchema = z.object({
  message: z.string(),
  job_application: JobApplicationSchema,
});

export const GenerateCoverLetterResponseSchema = z.object({
  message: z.string(),
  job_application: JobApplicationSchema,
});
