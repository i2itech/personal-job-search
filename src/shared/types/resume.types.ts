import { z } from "zod";

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

export const ResumeDetailsSchema = z.object({
  job_application_id: z.string().describe("Unique identifier of the job application to generate resume for"),
  summary: z.string().describe("Professional summary highlighting key qualifications and career objectives"),
  skill_sets: z
    .array(ResumeSkillSetSchema)
    .describe("Categorized list of professional skills and competencies, ordered by relevance"),
  work_experience: z
    .array(ResumeWorkExperienceSchema)
    .describe("Chronological work history showcasing professional experience and achievements"),
});

export type ResumeDetails = z.infer<typeof ResumeDetailsSchema>;
