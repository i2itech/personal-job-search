import { z } from "zod";
import { OpportunitySchema, ResumeDetailsSchema } from "../../../shared/types";

// Create Job Application
export const CreateJobApplicationRequestSchema = z
  .object({
    company_name: z.string().describe("The name of the company offering the job"),
    company_website_url: z
      .string()
      .optional()
      .describe("The official website URL of the company. Either this or company_linkedin_url must be provided."),
    company_linkedin_url: z
      .string()
      .optional()
      .describe("The LinkedIn profile URL of the company. Either this or company_website_url must be provided."),
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
    min_estimated_value: z
      .number()
      .optional()
      .describe("The minimum estimated value in USD and either hourly or yearly"),
    max_estimated_value: z
      .number()
      .optional()
      .describe("The maximum estimated value in USD and either hourly or yearly"),
  })
  .openapi("CreateJobApplicationRequest");

export type CreateJobApplicationRequest = z.infer<typeof CreateJobApplicationRequestSchema>;

export const CreateJobApplicationResponseSchema = z
  .object({
    message: z.string(),
    job_application: OpportunitySchema,
  })
  .openapi("CreateJobApplicationResponse");

// Update Job Application
export const UpdateJobApplicationRequestSchema = OpportunitySchema.partial()
  .omit({
    id: true,
    is_draft: true,
  })
  .describe("Include only the fields you want to update")
  .openapi("UpdateJobApplicationRequest");
export type UpdateJobApplicationRequest = z.infer<typeof UpdateJobApplicationRequestSchema>;

export const UpdateJobApplicationResponseSchema = z
  .object({
    message: z.string(),
    job_application: OpportunitySchema,
  })
  .openapi("UpdateJobApplicationResponse");

export const UpsertResumeDetailsRequestSchema = z
  .object({
    job_application_id: z.string(),
    details: z.discriminatedUnion("type", [
      z.object({
        type: z.literal("summary"),
        summary: z.string(),
      }),
      z.object({
        type: z.literal("skill_sets"),
        skill_sets: ResumeDetailsSchema.shape.skill_sets,
      }),
      z.object({
        type: z.literal("work_experience"),
        work_experience: ResumeDetailsSchema.shape.work_experience,
      }),
    ]),
  })
  .openapi("UpsertResumeDetailsRequest");

export type UpsertResumeDetailsRequest = z.infer<typeof UpsertResumeDetailsRequestSchema>;

export const UpsertResumeDetailsResponseSchema = z
  .object({
    message: z.string(),
    resume_details: ResumeDetailsSchema,
  })
  .openapi("UpsertResumeDetailsResponse");

// Generate Resume
export const GenerateResumeRequestSchema = z
  .object({
    job_application_id: z.string().describe("Unique identifier of the job application to generate resume for"),
  })
  .openapi("GenerateResumeRequest");

export type GenerateResumeRequest = z.infer<typeof GenerateResumeRequestSchema>;

export const GenerateResumeResponseSchema = z
  .object({
    message: z.string(),
    job_application: OpportunitySchema,
  })
  .openapi("GenerateResumeResponse");

// Generate Cover Letter
export const GenerateCoverLetterRequestSchema = z
  .object({
    job_application_id: z.string().describe("Unique identifier of the job application to generate cover letter for"),
    cover_letter: z
      .string()
      .describe(
        "The content of the cover letter, tailored to the job application. DO NOT include markdown formatting."
      ),
  })
  .openapi("GenerateCoverLetterRequest");

export type GenerateCoverLetterRequest = z.infer<typeof GenerateCoverLetterRequestSchema>;

export const GetJobApplicationResponseSchema = OpportunitySchema;

export const GenerateCoverLetterResponseSchema = z
  .object({
    message: z.string(),
    job_application: OpportunitySchema,
  })
  .openapi("GenerateCoverLetterResponse");
